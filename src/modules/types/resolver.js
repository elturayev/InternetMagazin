import { GraphQLScalarType, Kind }  from "graphql"
import  { GraphQLUpload}  from "graphql-upload"

const usernameScalar = new GraphQLScalarType({
	name: "Name",
	description: "Username should not exceed 50 symbols!",
	serialize: checkName,
	parseValue: checkName,
	parseLiteral: function (AST){
		if(AST.kind == Kind.STRING){
			return checkName(AST.value)
		}
		else throw new Error("Not type username!")
	}
})

function checkName(value){
	if(value.trim().length > 50 || value.trim().length < 2) throw new Error("Username error entered!")
	return value
}


const contactScalar = new GraphQLScalarType({
	name: "Contact",
	description: "This contact length max 12!",
	serialize: checkContact,
	parseValue: checkContact,
	parseLiteral: function (AST){
		if(AST.kind == Kind.STRING){
			return checkContact(AST.value)
		}
		else throw new Error("Not type contact!")
	}
})

function checkContact(value){
	if(!(/^998[389][012345789][0-9]{7}$/).test(value)) throw new Error("Contact value must be valid contact!")
	return value
}

const emailScalar = new GraphQLScalarType({
	name: "Email",
	description: "This email in (@,.)!",
	serialize: checkEmail,
	parseValue: checkEmail,
	parseLiteral: function (AST){
		if(AST.kind == Kind.STRING){
			return checkEmail(AST.value)
		}
		else throw new Error("Not type email!")
	}
})

function checkEmail(value){
	if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(value))throw new Error("There is not email!")
	return value
}

export default {
	Name: usernameScalar,
	Contact: contactScalar,
	Email: emailScalar,
	Upload: GraphQLUpload,
}