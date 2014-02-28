Ext.define('LifeDJTU.store.CourseRows', {
    extend: 'Ext.data.Store',

    config: {
        model: "LifeDJTU.model.CourseRow",
        proxy: {
            type: "ajax",
            url : "data/courseRows.json",
            reader: {
                type: "json",
                rootProperty: "courses"
            }
        },
        autoLoad: true
    }
});