import dotenv from "dotenv";
import express from "express";
import { checkSchema, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { HttpActionResult } from "./action_results";
import { UserData } from "./entities/user_data";
import { AuthenticationService } from "./services/auth_service";
import { loginSchema, registerSchema } from "./validators";

dotenv.config();
const app = express();
app.use(express.json())

let refreshTokens:any = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    //verify existance
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET??"", (err:any, user:any) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name })
      res.json({ accessToken: accessToken })
    })
  })
  
  app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter((token:any) => token !== req.body.token)
    //delete refresh token
    res.sendStatus(204)
  })
  
  app.post('/login', checkSchema(loginSchema), (req:any, res:any) => {
    // Authenticate User
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({
            errors: validationResult(req).array()
        });
    }

    const username = req.body.username
    const user = { name: username }
  
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET??"")
    // add refresh token
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  })


  app.post('/register', checkSchema(registerSchema), async (req:any, res:any) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({
            errors: validationResult(req).array()
        });
    }
    const response : HttpActionResult = await new AuthenticationService().registerUser(req.body);
    res.statusCode = response.statusCode;
    res.json(response.body);
  })
  
  function generateAccessToken(user:any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET??"", { expiresIn: '15s' })
  }

app.listen(8080);