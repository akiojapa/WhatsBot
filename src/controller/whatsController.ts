import { Request, Response } from 'express'

class whatsController{    
    public async status(req: Request, res: Response) {
        return res.json('BOT ONLINE')
    }
}

export default new whatsController()