import { h, JSX } from "preact";
import { CardsView } from "./cards";
import { HeaderView } from "./header";
import { FooterView } from "./footer";
import { IWebpushr } from "../ducks/reducer";
import { IDispatch } from "../ducks/types";
import { IHistoryRecord } from "../models/history";
import { ModalAmrap } from "./modalAmrap";
import { DateUtils } from "../utils/date";
import { ModalWeight } from "./modalWeight";
import { Timer } from "./timer";
import { IProgressMode, Progress } from "../models/progress";
import { ModalDate } from "./modalDate";
import { ISettings } from "../models/settings";
import { IconEdit } from "./iconEdit";

interface IProps {
  progress: IHistoryRecord;
  history: IHistoryRecord[];
  settings: ISettings;
  dispatch: IDispatch;
  timerSince?: number;
  timerMode?: IProgressMode;
  webpushr?: IWebpushr;
}

export function ProgramDayView(props: IProps): JSX.Element | null {
  const progress = props.progress;
  const timers = props.settings.timers;

  if (progress != null) {
    // TODO: What to do if program missing?
    return (
      <section className="relative h-full">
        <HeaderView
          title={
            <button
              onClick={() => {
                if (!Progress.isCurrent(progress)) {
                  props.dispatch({ type: "ChangeDate", date: progress.date });
                }
              }}
            >
              {DateUtils.format(progress.date)}
            </button>
          }
          subtitle={progress.programName}
          left={
            <button
              onClick={() => {
                if (Progress.isCurrent(progress) || confirm("Are you sure?")) {
                  props.dispatch({ type: "CancelProgress" });
                }
              }}
            >
              {Progress.isCurrent(progress) ? "Back" : "Cancel"}
            </button>
          }
          right={
            <div className="px-3">
              <button
                onClick={() => {
                  if (confirm("Are you sure?")) {
                    props.dispatch({ type: "DeleteProgress" });
                  }
                }}
              >
                {Progress.isCurrent(progress) ? "Cancel" : "Delete"}
              </button>
            </div>
          }
        />
        <CardsView
          settings={props.settings}
          progress={progress}
          isTimerShown={!!props.timerSince}
          dispatch={props.dispatch}
          onChangeReps={(mode) => {
            if (Progress.isCurrent(progress)) {
              props.dispatch({ type: "StartTimer", timestamp: new Date().getTime(), mode });
            }
          }}
        />
        <Timer
          mode={props.timerMode ?? "workout"}
          timerStart={props.timerSince}
          webpushr={props.webpushr}
          timers={timers}
          dispatch={props.dispatch}
        />
        <FooterView
          dispatch={props.dispatch}
          buttons={
            Progress.isCurrent(props.progress) ? (
              <button className="p-4" onClick={() => Progress.editDayAction(props.dispatch)}>
                <IconEdit />
              </button>
            ) : undefined
          }
        />
        <ModalAmrap isHidden={progress.ui?.amrapModal == null} dispatch={props.dispatch} />
        <ModalWeight
          isHidden={progress.ui?.weightModal == null}
          units={props.settings.units}
          dispatch={props.dispatch}
          weight={progress.ui?.weightModal?.weight ?? 0}
        />
        <ModalDate
          isHidden={progress.ui?.dateModal == null}
          dispatch={props.dispatch}
          date={progress.ui?.dateModal?.date ?? ""}
        />
      </section>
    );
  } else {
    return null;
  }
}
