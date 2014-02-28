/**
 * Created by apple on 12/23/13.
 */
Ext.define('LifeDJTU.view.CourseBoxPanel',{
    extend:'Ext.grid.Grid',
    xtype:'courseboxpanel',


    config:{
        scrollable:{
            direction: 'both',
            directionLock: false
        },
        columns: [
            { text :'', dataIndex:'',},
            { text: 'Name',  dataIndex: 'name', width: 200},
            { text: 'Email', dataIndex: 'email', width: 250},
            { text: 'Phone', dataIndex: 'phone', width: 120}
        ]
    }

});