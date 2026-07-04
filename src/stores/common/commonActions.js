import { createAction } from '@reduxjs/toolkit';

export const resetApp = createAction('app/resetApp');
export const logoutAndClear = createAction('app/logoutAndClear');
