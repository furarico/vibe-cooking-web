import {
  AuthTypes,
  Connector,
  IpAddressTypes,
} from '@google-cloud/cloud-sql-connector';

export async function getClientOptions() {
  const connector = new Connector();

  const instanceConnectionName = `${process.env.CLOUD_SQL_PROJECT_ID}:${process.env.CLOUD_SQL_REGION}:${process.env.CLOUD_SQL_INSTANCE_NAME}`;

  const clientOpts = await connector.getOptions({
    authType: AuthTypes.IAM,
    ipType: IpAddressTypes.PUBLIC,
    instanceConnectionName,
  });

  return clientOpts;
}
