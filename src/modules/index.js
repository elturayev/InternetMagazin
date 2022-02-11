import { makeExecutableSchema } from '@graphql-tools/schema'
import TypeModel from './types/index.js'
import AdminModel from './admin/index.js'
import UserModel from './user/index.js'

export default makeExecutableSchema({
  typeDefs:[
    TypeModel.typeDefs,
    AdminModel.typeDefs,
    UserModel.typeDefs
  ],
  resolvers:[
    TypeModel.resolvers,
    AdminModel.resolvers,
    UserModel.resolvers
  ]
})