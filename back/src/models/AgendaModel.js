const mongoose = require("mongoose");


const {Schema} = mongoose

const agendamentoModel = new Schema({
    data:{
        type:Date,
        required:true,
    },
    servico:{
        type: String,
        lowercase :true,
        required:true,
        trim:true
    },
    horario:{
        type:Date,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    status:{
        type:String,
        enum:["ativo", "cancelado","pendente"],
        default:"pendente"
    }
},
{timestamps:true}
)
agendamentoModel.index(
    {
        horario:1
    },
    {unique:true}
)
const Agenda = mongoose.model("Agenda", agendamentoModel)

module.exports = Agenda;