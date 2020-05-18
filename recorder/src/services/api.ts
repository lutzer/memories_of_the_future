import _ from 'lodash'
import { config } from "../config"
import { ProjectSchema } from './database'

class ApiNoDataError extends Error  {
  constructor(message : string) {
    super(message)
  }
}

class Api {
  static async getProjectByName(name: string) : Promise<{project : ProjectSchema}> {
    let response = await fetch(config.apiAdress + 'projects/?name=' + name)
    let json = await response.json()
    if (_.isEmpty(json.project))
      throw new ApiNoDataError(`There is no project with the name ${name}.`)
    return json
  }
}

export { Api, ApiNoDataError }