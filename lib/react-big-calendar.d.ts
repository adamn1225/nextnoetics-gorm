declare module 'react-big-calendar' {
    import { ComponentType } from 'react';

    export interface CalendarProps<TEvent = Event, TResource = object> {
        localizer: object;
        events?: TEvent[];
        startAccessor?: string | ((event: TEvent) => Date);
        endAccessor?: string | ((event: TEvent) => Date);
        allDayAccessor?: string | ((event: TEvent) => boolean);
        titleAccessor?: string | ((event: TEvent) => string);
        resourceAccessor?: string | ((event: TResource) => any);
        resourceIdAccessor?: string | ((resource: TResource) => any);
        resourceTitleAccessor?: string | ((resource: TResource) => string);
        resources?: TResource[];
        step?: number;
        timeslots?: number;
        view?: string;
        views?: string[] | object;
        defaultView?: string;
        defaultDate?: Date;
        min?: Date;
        max?: Date;
        scrollToTime?: Date;
        onNavigate?: (newDate: Date, view: string, action: string) => void;
        onView?: (view: string) => void;
        onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[]; action: 'select' | 'click' | 'doubleClick' }) => void;
        onSelectEvent?: (event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void;
        onDoubleClickEvent?: (event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void;
        onKeyPressEvent?: (event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void;
        onSelecting?: (range: { start: Date; end: Date }) => boolean | undefined;
        selected?: any;
        selectable?: boolean | 'ignoreEvents';
        longPressThreshold?: number;
        popup?: boolean;
        popupOffset?: number | { x: number; y: number };
        toolbar?: boolean;
        agendaHeaderFormat?: (date: Date, culture: string, localizer: object) => string;
        agendaDateFormat?: (date: Date, culture: string, localizer: object) => string;
        agendaTimeFormat?: (date: Date, culture: string, localizer: object) => string;
        agendaTimeRangeFormat?: (range: { start: Date; end: Date }, culture: string, localizer: object) => string;
        eventPropGetter?: (event: TEvent, start: Date, end: Date, isSelected: boolean) => object;
        slotPropGetter?: (date: Date) => object;
        dayPropGetter?: (date: Date) => object;
        showMultiDayTimes?: boolean;
        rtl?: boolean;
        components?: object;
        formats?: object;
        messages?: object;
        culture?: string;
        dayLayoutAlgorithm?: 'overlap' | 'no-overlap';
    }

    export const Calendar: ComponentType<CalendarProps>;
    export const momentLocalizer: (momentInstance: any) => object;
}