Ext.define('LifeDJTU.model.CourseRow', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'index',     type: 'int'},
            {name: 'mon',      type: 'string'},
            {name: 'tue',    type: 'string'},
            {name: 'wed',   type: 'string'},
            {name: 'thu', type: 'string'},
            {name: 'fri', type: 'string'},
            {name: 'sat', type: 'string'},
            {name: 'sun', type: 'string'}


        ]

    }


});