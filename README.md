# About

Snapshot-Generator is a Chrome plug-in that allows you to take screenshots for automation with Tedamface in web products. With the rules set in Snapshot-Generator, xml file extension of the elements on the web page is created. This xml extension file is uploaded to Tedamface and used in the preparation of the related scenario. We have a Snapshot icon in the upper right area of our browser screen as Chrome plugin. 

<img width="207" alt="snapshot1" src="https://user-images.githubusercontent.com/44693634/48130515-0025fd80-e29e-11e8-8d39-86d51c59e2b2.png">

# Snapshot-Generator

Main and Settings consists of two parts.

## Settings

<img width="252" alt="snapshot2" src="https://user-images.githubusercontent.com/44693634/48134518-35851800-e2ab-11e8-8c16-12ff897ba29b.png">

This is the section where the Config file is loaded, saved, created, and modified. The Config file is used to be associated in the corresponding scenario step. The config file is uploaded with the config file button. With the Export config file button, the previously created config file is downloaded. A new config file is created with the Create config file button.

### Create Config File
This is the first time the Config file was created. This page defines the rules for the elements to print to the xml file. Formname and Version are mandatory rules. The value must be entered in this field without creating page-specific rules.

Add Rule button to start defining rules. For each rule to be defined, click the Add Rule button.

<img width="596" alt="snapshot3" src="https://user-images.githubusercontent.com/44693634/48130939-53e51680-e29f-11e8-849d-ddd512ff792f.png">

The Rule type field contains Click, Read, or Write options. The appropriate option is selected for the element to be defined. 
For example, "click" is selected in areas such as radio button, check box. textfield, textarea in areas such as "write" and label areas "read" is selected. Rule name in the field to be defined according to the appropriate element is defined. 
Define the element with define button.

<img width="600" alt="snapshot4" src="https://user-images.githubusercontent.com/44693634/48131021-9d356600-e29f-11e8-8d15-a534af33668c.png">

#### Define Finds

The first process on the Define Rule screen is Define Finds. 

Finds Type: Specifies whether the value to be defined is selected from html elements or url. If the area to be defined is selected from the HTML elements, "Finds Type" is selected as the element. If it is selected from Url, it is selected as Url. 
Finds Type Value must be set if Element is selected as Finds type. 

Find Type Value: The html of the value to be defined can be more than one type of html element. In this field, the type of element to be written according to the rule is determined. 
After Finds Type Value is set, click Add Find button.

<img width="451" alt="snapshot5" src="https://user-images.githubusercontent.com/44693634/48133241-3ae06380-e2a7-11e8-9aa0-f92b3d973bd5.png">

The Find Parameter Panel opens. In this panel, restrictions should be made so that not all input values of the element we define the rules are met.

Node type: This field selects which of the properties in the input is checked. The Node Type Value field for Url, InnerText, Value, and Xpath should not be returned, and the Node Type Value for Attribute must be populated.

Operator Type: Specifies whether the value to be defined equals the value of the input in xml, contains that value, or no value.

Go to the Define Tag step with the Next button.

<img width="441" alt="snapshot6" src="https://user-images.githubusercontent.com/44693634/48133386-a7f3f900-e2a7-11e8-849a-328ca61f94fa.png">

#### Define Tags

In this section unique identifier is defined.  Query selector provides to reach html element which has no id attribute by searching its parent element.

Example html code :

    <div tabindex="0" class="v-select v-widget v-readonly v-has-width" id="component.TedamUserRoleComboBox" aria-labelledby="gwt-uid-85" div>
       
     <select class="v-select-select" size="1" tabindex="0" disabled="" style="width: 100%;"><option value="1"> ></select>


Because of the select element has not id, query selector search id its parent element which is div element.

The Extract Parameter Panel opens by clicking Add Extract button. This panel is filled according to the id properties that we will define.

Extract Type: to determine whether id is a string or a boolean value.

Node type: In this field, the selection of URL, InnerText, Value, XPath or Attribute is selected.

<img width="445" alt="snapshot7" src="https://user-images.githubusercontent.com/44693634/48133735-e211ca80-e2a8-11e8-9271-98c31e4a018c.png">


#### Define Title

Sometimes the id input field does not contain a value that the user understands, for example, the name field is a value that the user will understand.

At such times, the Define title fields should be filled values which users can remember easily.

The fields on the Define Tag tab have the same properties as the Define Title fields.


<img width="444" alt="snapshot8" src="https://user-images.githubusercontent.com/44693634/48133851-3452eb80-e2a9-11e8-856c-c3ade3dc295f.png">

#### Define Value

Define Value is the tab to reach fillable fields values such as textbox elements.

In steps such as click, read, and not written values, this step remains Disable.

When the value is written in the text area field and the snapshot is taken, the entered value is displayed in the xml file.

<img width="443" alt="snapshot9" src="https://user-images.githubusercontent.com/44693634/48133924-6e23f200-e2a9-11e8-8d10-9204b5fcd24d.png">


#### Define Enabled

Some textarea on the screen can be enable or disable to write value. In this section, the value is defined to be enable or disable. 

Click the Add Extract button. Boolean is selected because it is true or false. 

The value field filled with "true" value if its enable.

<img width="446" alt="snapshot10" src="https://user-images.githubusercontent.com/44693634/48134050-d246b600-e2a9-11e8-8c66-b91b4c061b31.png">

Click Finish button. The Define Rule screen is closed. 

On the Settings screen, click on the Update config file button. 

For each rule definition, these steps are made according to the relevant html line.

<img width="581" alt="snapshot11" src="https://user-images.githubusercontent.com/44693634/48134156-28b3f480-e2aa-11e8-8a5d-e6e66dc1292d.png">

## Main

This is the part of taking snapshot according to defined rules. Enter snapshot file name and click ‘Save Content to a File’ to download xml file.

<img width="250" alt="snapshot12" src="https://user-images.githubusercontent.com/44693634/48134463-0ff80e80-e2ab-11e8-9d71-7c61bc0951bb.png">

# Examples

Let's define a rule for the search field at "https://www.amazon.com.tr/". It is the text field, so we need to define a “Write” type rule. First, click on the search field and right click to select Inspect.

The source code of the field related to Inspect will be accessed.










