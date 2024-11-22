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

export interface Callback {
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

export interface Notification {
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
  data: [];
  entities: any[];
}
