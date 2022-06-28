// @ts-ignore
import Calendar from '@event-calendar/core';
// @ts-ignore
import Interaction from '@event-calendar/interaction';
// @ts-ignore
import TimeGrid from '@event-calendar/time-grid';
// @ts-ignore
import List from '@event-calendar/list';
// @ts-ignore
import ResourceTimeGrid from '@event-calendar/resource-time-grid';
// @ts-ignore
import DayGrid from '@event-calendar/day-grid';

// @ts-ignore
import styles from '@event-calendar/core/index.css';

import { html, LitElement, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Event } from '../types';

export class EventCalendar extends LitElement {
  @property({ type: Object })
  events: Array<Event> = [];

  @query('#calendar')
  calendarEl!: HTMLElement;

  @property({ type: Object })
  props: any = {};

  calendar: any;

  firstUpdated() {
    this.calendar = new Calendar({
      target: this.calendarEl,
      props: {
        plugins: [TimeGrid, Interaction, List, ResourceTimeGrid, DayGrid],
        options: {
          view: 'timeGridWeek',
          events: this.events,
          dateClick: (dateClickInfo: any) => {
            this.dispatchEvent(
              new CustomEvent('date-clicked', {
                bubbles: true,
                composed: true,
                detail: dateClickInfo,
              })
            );
          },
          ...this.props,
        },
      },
    });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has('events')) {
      this.calendar.setOption('events', this.events);
    }
  }

  render() {
    return html` <div id="calendar"></div> `;
  }

  static styles = [styles];
}
