import { environment } from '../../../environments/environment'

export function getVersion(): string {
    return environment.version
}
