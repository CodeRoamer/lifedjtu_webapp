# Sencha TouchGrid

You can use Sencha TouchGrid to display large amounts of tabular data on the client side. Essentially a supercharged
&lt;table&gt;, TouchGrid makes it easy to fetch, sort and filter large amounts of data.

Sencha TouchGrid is available in the [Sencha Touch Bundle](http://www.sencha.com/products/touch-bundle/).

Grids are composed of two main pieces - a {@link Ext.data.Store Store} of data and a set of columns to render.

## Basic Grid

    @example
    Ext.create('Ext.data.Store', {
        storeId: 'simpsonsStore',
        fields: ['name', 'email', 'phone'],
        data: {'items': [
            { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
            { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
            { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
            { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
        ]}
    });

    Ext.create('Ext.grid.Grid', {
        title: 'Simpsons',
        store: Ext.data.StoreManager.lookup('simpsonsStore'),
        columns: [
            { text: 'Name',  dataIndex: 'name', width: 200},
            { text: 'Email', dataIndex: 'email', width: 250},
            { text: 'Phone', dataIndex: 'phone', width: 120}
        ],
        height: 200,
        width: 400,
        renderTo: Ext.getBody()
    });

This code produces a simple grid with three columns. We specified a Store that loads JSON data inline.
In most apps, you can place the grid inside another container and don't need to use the
{@link #height}, {@link #width}, and {@link #renderTo} configurations, but they are included here to make it easy to get
up and running.

The grid we just created contains a header bar with a title ('Simpsons'), a row of column headers directly underneath,
and finally the grid rows under the headers.

## Configuring Columns

By default, each column is sortable and toggles between ascending and descending sorting when you click its header.
It's easy to configure each column - here we use the same example as before and modify the columns config:

    columns: [
        {
            text: 'Name',
            dataIndex: 'name',
            sortable: false,
            width: 250
        },
        {
            text: 'Email',
            dataIndex: 'email',
            hidden: true
        },
        {
            text: 'Phone',
            dataIndex: 'phone',
            width: 100
        }
    ]

By setting sortable to false, this example disables sorting on the 'Name' column so that clicking 
the Name column's header now has no effect. We also made the Email
column hidden by default (it can be shown again by using the {@link Ext.grid.plugin.ViewOptions ViewOptions} plugin).
See the {@link Ext.grid.column.Column column docs} for more details.

## Renderers

As well as customizing columns, it's easy to alter the rendering of individual cells using renderers. A renderer is
tied to a particular column and is passed the value that would be rendered into each cell in that column. For example,
we could define a renderer function for the email column to turn each email address into a mailto link:

    columns: [
        {
            text: 'Email',
            dataIndex: 'email',
            renderer: function(value) {
                return Ext.String.format('<a href="mailto:{0}">{1}</a>', value, value);
            }
        }
    ]

See the {@link Ext.grid.column.Column column docs} for more information on renderers.

## Sorting & Filtering

Every grid is attached to a {@link Ext.data.Store Store}, which provides multi-sort and filtering capabilities. It's
easy to set up a grid to be sorted from the start:

    var myGrid = Ext.create('Ext.grid.Panel', {
        store: {
            fields: ['name', 'email', 'phone'],
            sorters: ['name', 'phone']
        },
        columns: [
            { text: 'Name',  dataIndex: 'name' },
            { text: 'Email', dataIndex: 'email' }
        ]
    });

Sorting at run-time is easily accomplished by simply clicking each column header. If you need to sort
more than one field at run-time, just add new sorters to the store:

    myGrid.store.sort([
        { property: 'name',  direction: 'ASC' },
        { property: 'email', direction: 'DESC' }
    ]);

See {@link Ext.data.Store} for examples of filtering.

## Plugins and Features

TouchGrid supports extra functionality through plugins:

 - {@link Ext.grid.plugin.ViewOptions ViewOptions} - Adds the ability to show or hide columns and reorder them.
 - {@link Ext.grid.plugin.ColumnResizing ColumnResizing} - Allows for the ability to pinch to resize columns.
 - {@link Ext.grid.plugin.Editable Editable} - Enables editing grid contents for an entire row at a time.
 - {@link Ext.grid.plugin.MultiSelection MultiSelection} - Selects and deletes several rows at a time.
 - {@link Ext.grid.plugin.PagingToolbar PagingToolbar} - Adds a toolbar at the bottom of the grid that allows you to quickly navigate to another page of data.
 - {@link Ext.grid.plugin.SummaryRow SummaryRow} - Adds and pins an additional row to the top of the grid that enables you to display summary data.
