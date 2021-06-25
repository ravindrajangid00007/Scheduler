'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( { Task }) {
      // define association here
      this.hasMany(Task , {foreginKey: 'teacherId'});
    }

    // toJSON(){
    //   return { ...this.get(), id: undefined}
    // };
  };
  Teacher.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'teachers',
    modelName: 'Teacher',
  });
  return Teacher;
};