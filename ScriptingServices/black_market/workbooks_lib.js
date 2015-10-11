/* globals $ */
/* eslint-env node, dirigible */

var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createWorkbooks = function() {
    var input = ioLib.read($.getRequest().getInputStream());
    var requestBody = JSON.parse(input);
    var connection = $.getDatasource().getConnection();
    try {
        var sql = "INSERT INTO WORKBOOKS (";
        sql += "WORKBOOK_ID";
        sql += ",";
        sql += "WORKBOOK_KLAS";
        sql += ",";
        sql += "WORKBOOK_SUSTOQNIE";
        sql += ",";
        sql += "WORKBOOK_PREDMET";
        sql += ",";
        sql += "WORKBOOK_USER";
        sql += ",";
        sql += "WORKBOOK_STATUS";
        sql += ") VALUES ("; 
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = $.getDatabaseUtils().getNext('WORKBOOKS_WORKBOOK_ID');
        statement.setInt(++i, id);
        statement.setInt(++i, requestBody.workbook_klas);
        statement.setString(++i, requestBody.workbook_sustoqnie);
        statement.setString(++i, requestBody.workbook_predmet);
        statement.setString(++i, requestBody.workbook_user);
        statement.setString(++i, requestBody.workbook_status);
        statement.executeUpdate();
		$.getResponse().getWriter().println(id);
        return id;
    } catch(e) {
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    return -1;
};

// read single entity by id and print as JSON object to response
exports.readWorkbooksEntity = function(id) {
    var connection = $.getDatasource().getConnection();
    try {
        var result;
        var statement = connection.prepareStatement("SELECT * FROM WORKBOOKS WHERE " + exports.pkToSQL());
        statement.setInt(1, id);
        
        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            result = createEntity(resultSet);
        } else {
        	entityLib.printError($.getResponse().SC_NOT_FOUND, 1, "Record with id: " + id + " does not exist.");
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        $.getResponse().getWriter().println(jsonResponse);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// read all entities and print them as JSON array to response
exports.readWorkbooksList = function(limit, offset, sort, desc) {
    var connection = $.getDatasource().getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + $.getDatabaseUtils().createTopAndStart(limit, offset);
        }
        sql += " * FROM WORKBOOKS";
        if (sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if (sort !== null && desc !== null) {
            sql += " DESC ";
        }
        if (limit !== null && offset !== null) {
            sql += " " + $.getDatabaseUtils().createLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
        var jsonResponse = JSON.stringify(result, null, 2);
        $.getResponse().getWriter().println(jsonResponse);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

//create entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.workbook_id = resultSet.getInt("WORKBOOK_ID");
	result.workbook_klas = resultSet.getInt("WORKBOOK_KLAS");
    result.workbook_sustoqnie = resultSet.getString("WORKBOOK_SUSTOQNIE");
    result.workbook_predmet = resultSet.getString("WORKBOOK_PREDMET");
    result.workbook_user = resultSet.getString("WORKBOOK_USER");
    result.workbook_status = resultSet.getString("WORKBOOK_STATUS");
    return result;
}

function convertToDateString(date) {
    var fullYear = date.getFullYear();
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
    var dateOfMonth = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return fullYear + "/" + month + "/" + dateOfMonth;
}

// update entity by id
exports.updateWorkbooks = function() {
    var input = ioLib.read($.getRequest().getInputStream());
    var responseBody = JSON.parse(input);
    var connection = $.getDatasource().getConnection();
    try {
        var sql = "UPDATE WORKBOOKS SET ";
        sql += "WORKBOOK_KLAS = ?";
        sql += ",";
        sql += "WORKBOOK_SUSTOQNIE = ?";
        sql += ",";
        sql += "WORKBOOK_PREDMET = ?";
        sql += ",";
        sql += "WORKBOOK_USER = ?";
        sql += ",";
        sql += "WORKBOOK_STATUS = ?";
        sql += " WHERE WORKBOOK_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setInt(++i, responseBody.workbook_klas);
        statement.setString(++i, responseBody.workbook_sustoqnie);
        statement.setString(++i, responseBody.workbook_predmet);
        statement.setString(++i, responseBody.workbook_user);
        statement.setString(++i, responseBody.workbook_status);
        var id = responseBody.workbook_id;
        statement.setInt(++i, id);
        statement.executeUpdate();
		$.getResponse().getWriter().println(id);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// delete entity
exports.deleteWorkbooks = function(id) {
    var connection = $.getDatasource().getConnection();
    try {
        var statement = connection.prepareStatement("DELETE FROM WORKBOOKS WHERE " + exports.pkToSQL());
        statement.setString(1, id);
        statement.executeUpdate();
        $.getResponse().getWriter().println(id);
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

exports.countWorkbooks = function() {
    var count = 0;
    var connection = $.getDatasource().getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM WORKBOOKS');
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } catch(e){
        var errorCode = $.getResponse().SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    $.getResponse().getWriter().println(count);
};

exports.metadataWorkbooks = function() {
	var entityMetadata = {
		name: 'workbooks',
		type: 'object',
		properties: []
	};
	
	var propertyworkbook_id = {
		name: 'workbook_id',
		type: 'integer',
	key: 'true',
	required: 'true'
	};
    entityMetadata.properties.push(propertyworkbook_id);

	var propertyworkbook_klas = {
		name: 'workbook_klas',
		type: 'integer'
	};
    entityMetadata.properties.push(propertyworkbook_klas);

	var propertyworkbook_sustoqnie = {
		name: 'workbook_sustoqnie',
		type: 'string'
	};
    entityMetadata.properties.push(propertyworkbook_sustoqnie);

	var propertyworkbook_predmet = {
		name: 'workbook_predmet',
		type: 'string'
	};
    entityMetadata.properties.push(propertyworkbook_predmet);

	var propertyworkbook_user = {
		name: 'workbook_user',
		type: 'string'
	};
    entityMetadata.properties.push(propertyworkbook_user);

	var propertyworkbook_status = {
		name: 'workbook_status',
		type: 'string'
	};
    entityMetadata.properties.push(propertyworkbook_status);


	$.getResponse().getWriter().println(JSON.stringify(entityMetadata));
};

exports.getPrimaryKeys = function() {
    var result = [];
    var i = 0;
    result[i++] = 'WORKBOOK_ID';
    if (result === 0) {
        throw $.getExceptionUtils().createException("There is no primary key");
    } else if(result.length > 1) {
        throw $.getExceptionUtils().createException("More than one Primary Key is not supported.");
    }
    return result;
};

exports.getPrimaryKey = function() {
	return exports.getPrimaryKeys()[0].toLowerCase();
};

exports.pkToSQL = function() {
    var pks = exports.getPrimaryKeys();
    return pks[0] + " = ?";
};