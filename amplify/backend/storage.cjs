// Minimal storage resource descriptor for DynamoDB table
module.exports = {
  name: 'storage',
  type: 'dynamodb',
  properties: {
    tableName: 'OpPoWebTable',
    region: 'ap-southeast-1',
    primaryKey: 'pk',
  },
};
