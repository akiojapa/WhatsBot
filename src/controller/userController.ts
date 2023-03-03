import { Request, Response } from 'express'

import User from '../models/User'

class UserController{    
    public async store(req: Request, res: Response) {

        const { email } = req.body;

        let user = await User.create({ email: email });

        return res.json(user);
    }
}

export default new UserController()