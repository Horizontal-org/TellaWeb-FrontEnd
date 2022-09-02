import { AbilityBuilder, Ability, defineAbility } from '@casl/ability';

export const ROLES = {
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
  Reporter: 'reporter',

}

export const ENTITIES = {
  Reports: 'reports',
  RemoteConfigurations: 'remoteConfigurations',
  Users: 'users',
  Projects: 'projects',
  Web: 'web',
}

export const defaultAbility = defineAbility((can, cannot) => {
  
})

export const updateAbility = (user, ability) => {
  const { can, rules } = new AbilityBuilder(Ability);

  if (user.role === ROLES.Admin) {
    can('manage', 'all');
  } else if (user.role === ROLES.Editor) {
    can('manage', ENTITIES.Reports);
    can('manage', ENTITIES.Projects)
    can('read', ENTITIES.RemoteConfigurations)
    can('read', ENTITIES.Web)
  } else if (user.role === ROLES.Viewer) {
    can('read', ENTITIES.Projects)
    can('read', ENTITIES.Reports)
    can('read', ENTITIES.RemoteConfigurations)
    can('read', ENTITIES.Web)
  }

  ability.update(rules);  
}

export const validateRoute = (ability, route) => {

  let entity = null

  if (route.includes('report')) {
    entity = ENTITIES.Reports
  }
  if (route.includes('user')) {
    entity = ENTITIES.Users
  }
  if (route.includes('project')) {
    entity = ENTITIES.Projects
  }
  if (route.includes('configuration')) {
    entity = ENTITIES.RemoteConfigurations
  }

    
  if (entity) {
    return ability.can('read', entity)
  }
  return true
}

