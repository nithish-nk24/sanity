import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { blog } from './blog'
import { user } from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, blog, user],
}
