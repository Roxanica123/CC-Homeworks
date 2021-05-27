
import express from "express";
import dotenv from "dotenv";
import { checkSchema, validationResult } from "express-validator";
import { HttpActionResult } from "./action_results";
import { AuthenticationService, JwtService } from "./services";
import { loginSchema, registerSchema } from "./validators";

dotenv.config();
const app = express();
app.use(express.json())

app.post('/token', async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  const response = await new JwtService().getAccessToken(req.body.token);
  res.statusCode = response.statusCode;
  res.end(response.body);
})

app.delete('/logout', async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  const response = await new JwtService().deleteRefreshToken(req.body.token);
  res.statusCode = response.statusCode;
  res.end(response.body);
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

app.post('/roles', async (req, res) => {
  const token = req.body.token;
  if (token == null ) return res.sendStatus(401)
  const response = new JwtService().getRole(req.body.token);
  res.statusCode = response.statusCode;
  res.end(response.body);
})

app.listen(8080);