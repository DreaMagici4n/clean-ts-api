import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'
import { type EmailValidator } from '../signup/signup-protocols'
import { InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
      }
      if (!password) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
      return await new Promise(resolve => { resolve(ok('')) })
    } catch (error) {
      return serverError(new Error())
    }
  };
}
