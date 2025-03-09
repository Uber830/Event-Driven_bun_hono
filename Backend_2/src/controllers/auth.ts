import { Context } from "hono";
// import { genToken, newPasswordHash } from "../utils/genToken";
import {
  insertSuccessfulLogin,
  insertFailedLogin,
  loginForHours,
} from "../service/user";
// import { consumeFromQueue } from "../utils/rabbitmqConsumer";
import { AppError } from "../utils/classErrorCustom";

/**
 * @api {post} /Register insert Successful Login
 * @apiGroup Users
 * @apiName insertSuccessfulLogin
 */

export const loginSuccessFull = async (c: Context) => {};
