import { DB } from 'databases/mysql';
import { IConfiguration } from 'interfaces/configuration.interface';

export const getSettings = async () => {
  const settings = await DB.Configurations.findAll();
  return settings[0];
};

export const updateSettings = async (settings: IConfiguration) => {
  const setting = await getSettings();

  await DB.Configurations.update(
    {
      maxActiveEvents: settings.maxActiveEvents,
      maxEventCapacity: settings.maxEventCapacity,
    },
    { where: { id: setting.id } },
  );
};
