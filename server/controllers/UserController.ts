import { Request, Response } from 'express';
import { getRepository, Like, Not } from 'typeorm';
import User from '../models/User';

/**
 * User controller
 */
export default class UserController {
  /**
   * Find all user by email or by user name
   * @param req
   * @param res
   */
  static async findAllUserByEmailOrUsername(req: Request, res: Response): Promise<Response> {
    //Get the data from request body
    const { email = '', username = '' } = req.body;

    //Get user repository
    const userRepository = getRepository(User);

    try {
      //Find all the user by email with starting with email or username
      const users = await userRepository.find({
        where: [
          {
            email: email.length != 0 ? Like(`${email}%`) : ' ',
            id: Not((req.user as User).id),
          },
          {
            username: username.length != 0 ? Like(`${username}%`) : ' ',
            id: Not((req.user as User).id),
          },
        ],
      });
      //Return empty if not found
      if (users.length === 0) {
        return res.status(200).json([]);
      }
      //Return users if found
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
}
