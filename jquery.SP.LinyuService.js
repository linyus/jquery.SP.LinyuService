var ChildSelectName = "";
var ChildFieldValue = "";

function SPCustomServiceGetSelect(SourceParentField,SourceChildField,SourceList,ParentField,ChildField)
{
	ChildSelectName = SourceChildField;
	ChildFieldValue = ChildField;
	
	$("select[title=" + ChildSelectName + "]").html("<option value='0'>(None)</option>");
	
	var SelectItem = $("select[title=" + SourceParentField + "]").change(function(){
		var SelectItemValue = $("select[title=" + SourceParentField + "]").find('option:selected').text();
		if(SelectItemValue != "(None)")
		{	
			SPCustomServiceGetItems(SelectItemValue,SourceList,ParentField,ChildField);
		}
		else
		{
			$("select[title=" + ChildSelectName + "]").html("<option value='0'>(None)</option>");
		}
	});
}

function SPCustomServiceGetItems(SelectItemValue,SourceList,ParentField,ChildField)
{	
	var Context = new SP.ClientContext.get_current();
	var Web = Context.get_web();
	var List = Web.get_lists().getByTitle(SourceList);
	var Query = new SP.CamlQuery();
	
    Query.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'' + ParentField + '\' /><Value Type=\'Lookup\'>' + SelectItemValue + '</Value></Eq></Where></Query></View>');

	AllItems = List.getItems(Query);
	Context.load(AllItems, 'Include(Id,' + ChildField + ')');
	Context.executeQueryAsync(Function.createDelegate(this, this.Successed), Function.createDelegate(this, this.Failed));
}

function Successed() {
	var SelectText = "";
	var ListEnumerator = this.AllItems.getEnumerator();
	while(ListEnumerator.moveNext())
	{
		var CurrentItem = ListEnumerator.get_current();
		SelectText += "<option value='" + CurrentItem.get_id() + "'>" + CurrentItem.get_item(ChildFieldValue) + "</option>";
	}
	if(SelectText == "")
		SelectText = "<option value='0'>(None)</option>";
	$("select[title=" + ChildSelectName + "]").html(SelectText);
}

function Failed()
{
}
