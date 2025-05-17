import express from 'express';

import {
  getSettingsController,
  updateSettingsController,
} from 'modules/setting/setting.controller';

const settingRouter = express.Router();

settingRouter.get('/', getSettingsController);
settingRouter.put('/', updateSettingsController);

export default settingRouter;
