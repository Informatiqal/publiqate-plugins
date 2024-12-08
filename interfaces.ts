export interface Auth3LO {
  type?: string;
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  accessToken: string;
  expires?: string;
  accessUrl?: string;
}

export interface Auth2LO {
  type?: string;
  user: string;
  serviceClient: string;
  privateKey: string;
}

export interface AuthUserPass {
  user: string;
  pass: string;
}

export interface SMTPPluginDetails {
  details: {
    host: string;
    port?: number;
    secure?: boolean;
    auth: AuthUserPass | Auth3LO | Auth2LO;
    proxy?: string;
    from: string;
    to: string[];
    subject: string;
    /**
     * If both "html" and "template" properties exists then "template" is with priority
     */
    html?: string;
    /**
     * Path to the EJS template file.
     *
     * If both "html" and "template" properties exists then "template" is with priority
     */
    template: string;
    headers?: { [k: string]: string };
  };
}

export interface S3PluginDetails {
  details: {
    auth: S3Auth;
    region: string;
    bucket: string;
    acl?: string;
    key?: string;
    serverSideEncryption?: string;
  };
}

export interface NotificationRepo {
  type: NotificationObjectType;
  id: string;
  environment: string;
  name?: string;
  filter?: string;
  condition?: string;
  changeType: NotificationChangeType;
  propertyName?: string;
  options?: {
    getEntityDetails?: boolean;
    disableCors?: boolean;
    enabled?: boolean;
    whitelist?: string[];
  };
  callbacks: {
    type: string;
    enabled?: boolean;
    details?: any;
  }[];
}

export type NotificationObjectTypeExt = NotificationObjectType | "DataAlert";

export interface DataAlertScalarCondition {
  type: "scalar";
  name: string;
  description?: string;
  expression: string;
  results: {
    value: string | number;
    operator?: "<" | ">" | ">=" | "<=" | "==" | "!=" | "=" | "<>";
    variation?: string;
  }[];
}

export interface DataAlertListCondition {
  type: "list";
  name: string;
  description?: string;
  fieldName: string;
  operation: "present" | "missing";
  values: (string | number)[];
}

export interface DataAlertFieldSelection {
  field: string;
  values: (string | number)[];
}

export interface DataAlertBookmarkApply {
  bookmark: string;
}

export interface DataAlertCondition {
  selections: (DataAlertFieldSelection | DataAlertBookmarkApply)[];
  conditions: (DataAlertScalarCondition | DataAlertListCondition)[];
  options?: {
    user?: string;
  };
}

export interface NotificationDataAlert {
  type: NotificationObjectTypeExt;
  id: string;
  changeType?: "Update";
  handle?: string;
  environment: string;
  name?: string;
  filter?: string;
  "data-conditions": DataAlertCondition[];
  options?: {
    disableCors?: boolean;
    enabled?: boolean;
    whitelist?: string[];
  };
  callbacks: {
    type: string;
    enabled?: boolean;
    details?: any;
  }[];
}

export type Notification = NotificationRepo | NotificationDataAlert;

export type NotificationChangeType = "Add" | "Update" | "Delete";
export type NotificationObjectType =
  | "App"
  | "AnalyticConnection"
  | "ContentLibrary"
  | "DataConnection"
  | "Extension"
  | "ReloadTask"
  | "Stream"
  | "User"
  | "UserSyncTask"
  | "SystemRule"
  | "Tag"
  | "CustomPropertyDefinition"
  | "EngineService"
  | "OdagService"
  | "PrintingService"
  | "ProxyService"
  | "RepositoryService"
  | "SchedulerService"
  | "ServerNodeConfiguration"
  | "VirtualProxyConfig";

export interface QlikComm {
  name: string;
  host: string;
  userName?: string;
  userDir?: string;
  certs: string;
}

export interface NotificationData {
  config: Notification;
  environment: QlikComm;
  data: any[];
  entities: any[];
}

export interface S3Auth {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface HTMLPluginDetails {
  details: {
    template: string;
    path: string;
    engine?: "ejs" | "pug" | "mustache" | "handlebars";
  };
}
