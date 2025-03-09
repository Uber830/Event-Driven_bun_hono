export type userLoginEvent = {
  userId: string;
  username: string;
  email: string;
  loginTime: Date;
  ipAddress: string;
  userAgent: string;
};

export interface UserEvent {
  type: string;
  data: Omit<userLoginEvent, "loginTime"> & { attemptTime: Date };
}
