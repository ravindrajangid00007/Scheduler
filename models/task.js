'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( {Teacher} ) {
      // define association here
      this.belongsTo(Teacher , {foreignKey: 'teacherId'});
    }
    // toJSON(){
    //   return { ...this.get(), id: undefined , teacherId: undefined}
    // };
  };
  Task.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
  });
  return Task;
};