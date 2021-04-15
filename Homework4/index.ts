import dotenv from "dotenv";
import express from "express";
import { checkSchema, validationResult } from "express-validator";
import { HttpActionResult } from "./action_results";
import { AuthenticationService } from "./services/auth_service";
import { JwtService } from "./services/jwt_service";
import { loginSchema, registerSchema } from "./validators";

dotenv.config();
const app = express();
app.use(express.json())

let refreshTokens: any = []

app.post('/token', async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  const response = await new JwtService().getAccessToken(req.body.token);
  res.statusCode = response.statusCode;
  res.end(response.body);
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token: any) => token !== req.body.token)
  //delete refresh token
  res.sendStatus(204)
})

app.post('/login', checkSchema(loginSchema), async (req: any, res: any) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      errors: validationResult(req).array()
    });
  }
  const response: HttpActionResult = await new JwtService().getTokens(req.body);
  res.statusCode = response.statusCode;
  res.end(response.body);
})


app.post('/register', checkSchema(registerSchema), async (req: any, res: any) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      errors: validationResult(req).array()
    });
  }
  const response: HttpActionResult = await new AuthenticationService().registerUser(req.body);
  res.statusCode = response.statusCode;
  res.json(response.body);
})


app.listen(8080);