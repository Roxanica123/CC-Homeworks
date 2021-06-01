
import express, { response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { BadRequest, EmptyBody, HttpActionResult } from "./action_results";
import { UserTypes } from "./entities";
import { AuthenticationService, JwtService } from "./services";
import { RequestsValidationService } from "./services/request_validation_service";
import { loginSchema, registerSchema } from "./validators";

const app = express();
app.use(express.json())
app.get('/', async(req, res)=>{
  res.statusCode = 200;
  res.end("Pump IT Up Authentication microservive");
})

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
  if (token == null) return res.sendStatus(401)
  const response = await new JwtService().getRole(req.body.token);
  res.statusCode = response.statusCode;
  res.end(response.body);
})

app.patch('/premium', async (req, res) => {
  let hasAccess = await RequestsValidationService.instance.hasAcces(req, [UserTypes.PAYMENTS_SERVICE]);
  if (req.body.email === undefined) {
    hasAccess = new BadRequest(EmptyBody);
  }
  const response: HttpActionResult = hasAccess === true ?
    await new AuthenticationService().changeUserRole(req.body.email, UserTypes.PREMIUM) : hasAccess;
  res.statusCode = response.statusCode;
  res.end(response.body);
})

app.patch('/basic', async (req, res) => {
  let hasAccess = await RequestsValidationService.instance.hasAcces(req, [UserTypes.PAYMENTS_SERVICE]);
  if (req.body.email === undefined) {
    hasAccess = new BadRequest(EmptyBody);
  }
  const response: HttpActionResult = hasAccess === true ?
    await new AuthenticationService().changeUserRole(req.body.email, UserTypes.BASIC) : hasAccess;
  res.statusCode = response.statusCode;
  res.end(response.body);
})
app.patch('/moderator', async (req, res) => {
  let hasAccess = await RequestsValidationService.instance.hasAcces(req, [UserTypes.ADMIN]);
  if (req.body.email === undefined) {
    hasAccess = new BadRequest(EmptyBody);
  }
  const response: HttpActionResult = hasAccess === true ?
    await new AuthenticationService().changeUserRole(req.body.email, UserTypes.MODERATOR) : hasAccess;
  res.statusCode = response.statusCode;
  res.end(response.body);
})
app.listen(8080);