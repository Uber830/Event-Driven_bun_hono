import { userLoginEvent, UserEvent } from "../types/user";
import { insertSuccessfulLogin, insertFailedLogin } from "../service/user";

export const saveLoginEvent = async (userLoginEvent: userLoginEvent) => {
  try {
    await insertSuccessfulLogin(userLoginEvent);
    console.log("Login event saved successfully.");
  } catch (error) {
    console.error("Error saving login event:", error);
  }
};

export const saveFailedLoginEvent = async (userLoginEvent: UserEvent) => {
  try {
    await insertFailedLogin(userLoginEvent);
    console.log("Failed login event saved successfully.");
  } catch (error) {
    console.error("Error saving failed login event:", error);
  }
};
