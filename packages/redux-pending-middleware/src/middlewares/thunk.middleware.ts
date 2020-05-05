/**
 * some code was borrowed from this:
 * https://github.com/pburtchaell/redux-promise-middleware/blob/master/src/index.js
 */
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { isPromise } from '../helpers/utils';
import { patchEffect } from '../store/actions';
import { nanoid } from '../helpers/nanoid.utils';
export const pendingThunkMiddleware = ({ dispatch }: MiddlewareAPI) => (
  next: Dispatch
) => (action: AnyAction): AnyAction => {
  let promise;
  let data;

  if (action.payload) {
    const { payload } = action;

    if (isPromise(payload)) {
      promise = payload;
    } else if (isPromise(payload.promise)) {
      promise = payload.promise;
      data = payload.data;
      // when the promise returned by async function
    } else if (
      typeof payload === 'function' ||
      typeof payload.promise === 'function'
    ) {
      promise = payload.promise ? payload.promise() : payload();
      data = payload.promise ? payload.data : undefined;

      if (!isPromise(promise)) {
        return next({
          ...action,
          payload: promise,
        });
      }
    } else {
      return next(action);
    }
  } else {
    return next(action);
  }

  const { type, meta } = action.type;
  const effectId = nanoid();

  const getAction = (newPayload: any) => {
    const nextAction: AnyAction = { type };

    if (newPayload !== null && typeof newPayload !== 'undefined') {
      nextAction.payload = newPayload;
    }

    if (meta !== undefined) {
      nextAction.meta = meta;
    }

    return nextAction;
  };
  const handleReject = (reason: any) => {
    const rejectedAction = getAction(reason);
    dispatch(rejectedAction);
    dispatch(patchEffect(effectId));

    throw reason;
  };
  const handleFulfill = (value = null) => {
    const resolvedAction = getAction(value);
    dispatch(resolvedAction);
    dispatch(patchEffect(effectId));

    return { value, action: resolvedAction };
  };

  dispatch(patchEffect(effectId));
  next({
    type,
    // Include payload (for optimistic updates) if it is defined.
    ...(data !== undefined ? { payload: data } : {}),
    // Include meta data if it is defined.
    ...(meta !== undefined ? { meta } : {})
  });

  return promise.then(handleFulfill, handleReject);
};
