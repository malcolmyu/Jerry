/**
 * Created by Ellery1 on 16/6/6.
 */
import {FILTER, CHECK_DETAIL, PUSH_LOG, PUSH_BLOCK_POINT, CLEAR, CLOSE_DETAIL} from './action';
import {filter, checkDetail, pushLog, pushBlockPoint, clear, closeDetail} from './log';

export default function (state, action) {

    var logState = state.logger;

    switch (action.type) {
        case FILTER:
            return filter(logState, action.condition);

        case CHECK_DETAIL:
            return checkDetail(logState, action.current);

        case PUSH_LOG:
            return pushLog(logState, action.logData);

        case CLEAR:
            return clear(logState);

        case CLOSE_DETAIL:
            return closeDetail(logState);

        case PUSH_BLOCK_POINT:
            return pushBlockPoint(logState, action.logData);

        default:
            return logState;
    }
}