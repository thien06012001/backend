// Import database connection and configuration interface
import { DB } from 'databases/mysql';
import { IConfiguration } from 'interfaces/configuration.interface';

// Fetch the current application settings from the DB
export const getSettings = async () => {
  const settings = await DB.Configurations.findAll();

  return settings[0];
};

// Update the application settings
export const updateSettings = async (settings: IConfiguration) => {
  const setting = await getSettings();

  // Update the record with new values
  return await DB.Configurations.update(
    {
      maxActiveEvents: settings.maxActiveEvents,
      maxEventCapacity: settings.maxEventCapacity,
    },
    { where: { id: setting.id } },
  );
};
