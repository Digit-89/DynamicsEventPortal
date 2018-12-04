import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';
import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Session } from '../../../models/Session';
import * as $ from 'jquery';
import { LabelsService } from '../../../services/labels.service';
import { Observable } from '../../../../../node_modules/rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  @Input() readableEventId: string;
  sessions: Session[];
  hours: number[];
  schedule: Schedule;
  sessionsByDay: any;
  dateKeys: string[];
  selectedDateKey: string;
  errorMessage: string;

  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private labelsService: LabelsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadSessions();
  }

  private loadSessions(): void {
    this.eventService.getSessions(this.readableEventId)
    .subscribe(sessions => {
        this.sessions = sessions;
        this.sessions.forEach(s => {
          s.startTime = new Date(s.startTime);
          s.endTime = new Date(s.endTime);
        });
        this.sessionsByDay = {};
        this.dateKeys = [];
        this.generateSessionByDay();

        if (this.dateKeys.length > 0) {
          this.selectedDateKey = this.dateKeys[0];
          this.initSessionSchedule(this.selectedDateKey);
        }
      },
      error => console.error(error)
    );
  }

  private initSessionSchedule(dateKey: string): void {
    this.schedule = this.generateTimelinesForDay(this.sessionsByDay[dateKey]);
    this.hours = [];
    for (let i = this.schedule.startHour; i < this.schedule.endHour; i++) {
      this.hours.push(i);
    }
  }

  private currentDaySessions(): Session[] {
    return this.sessionsByDay[this.selectedDateKey];
  }

  private generateTimelinesForDay(sessionsInDay: Session[]): Schedule {
    const schedule: Schedule = {
      startHour: 23,
      endHour: 0,
      timelines: []
    };

    sessionsInDay.sort((a: Session, b: Session) => {
      return a.startTime < b.startTime ? -1 : 1;
    });

    for (const session of sessionsInDay) {
      if (session.startTime.getHours() < schedule.startHour) {
        schedule.startHour = session.startTime.getHours();
      }

      if (session.endTime.getHours() > schedule.endHour) {
        schedule.endHour = session.endTime.getHours();
      }

      if (schedule.timelines.length === 0) {
        schedule.timelines.push([]);
        schedule.timelines[0].push(session);
      } else {
        let newTimeline = true;

        for (let j = 0; j < schedule.timelines.length; j++) {
          const currTimeline = schedule.timelines[j];
          let nextTimeline = false;

          for (let k = 0; k < currTimeline.length; k++) {
            const existingSession = currTimeline[k];

            const startsDuringExistingSession =
              session.startTime >= existingSession.startTime &&
              session.startTime < existingSession.endTime;

            const endsDuringExistingSession =
              session.endTime > existingSession.startTime &&
              session.endTime <= existingSession.endTime;

            if (startsDuringExistingSession || endsDuringExistingSession) {
              // If this session is during an existing session move to the next timeline
              nextTimeline = true;
              break;
            }
          }

          if (!nextTimeline) {
            // No conflicting sessions
            currTimeline.push(session);
            newTimeline = false;
            break;
          }
        }

        if (newTimeline) {
          schedule.timelines.push([session]);
        }
      }
    }

    if (schedule.endHour === schedule.startHour) {
      schedule.endHour++;
    }

    return schedule;
  }

  private generateSessionByDay(): void {
    for (const session of this.sessions) {
      const start = session.startTime;
      const key = `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`;

      if (!this.sessionsByDay[key]) {
        this.sessionsByDay[key] = [];
        this.dateKeys.push(key);
      }

      this.sessionsByDay[key].push(session);
    }
  }

  private selectDate(dateKey: string): void {
    this.selectedDateKey = dateKey;
  }

  private dateToCssClass(dateKey: string): string {
    const date = new Date(dateKey);
    return `date${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  }

  private dateText(dateKey: string): Observable<string> {
    const date = new Date(dateKey);
    let day = this.daysOfWeek[date.getDay()];

    return this.labelsService.translateLabel(day).pipe(map(value => {
      return `${date.getMonth() + 1}/${date.getDate()}-${value}`;
    }));
  }

  private registerToSession(sessionId: string): void {
    this.userService.registerToSession(this.readableEventId, sessionId).subscribe(registrationCompleted => {
      if (registrationCompleted) {
        this.loadSessions();
      }
    }, error => this.errorMessage = error.message);
  }
}

interface Schedule {
  startHour: number;
  endHour: number;
  timelines: Session[][];
}
