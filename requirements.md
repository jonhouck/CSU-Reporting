DESIRED BUSINESS OUTCOMES:
Our construction services unit supervisors, when working on a system shutdown or major projects, are required to provide an end of shift PDF report which is to be distributed to management for review and editing, then distribution. There is a particular format for the report that is to be followed. Currently, the supervisors fill out a word document, including dragging and resizing images, and then save it as a PDF. This is time consuming and inefficient, and leads to inconsistencies in the format of the reports. We would like to streamline this process with a modern web application with dropdowns and tools to integrate to our enterprise SharePoint to import required data. The deliverable from the application should be a clean and properly formatted report. It is requested that this application be responsive and work well on mobile devices as well as desktop computers. There is a PDF in this folder called "Power App Request.pdf" which is the raw request information from the user, and contains an example of the desired report format. In addition to always grounding subsequent development tasks back to the desired business outcomes listed here, please also make sure we're delivering a result that's true to the requests from the "Power App Request.pdf" document. 

SYSTEM REQUIREMENTS:
The application will need to integrate with our enterprise Identity Provider for authentication and authorization.  We use Azure EntraID, so we will need to provision an app registration for this application. To access the SharePoint resources, the application will need to pass through credentials to access the required resources. The connection to SharePoint should be exclusively READ ONLY and there should be ZERO risk that any of the files in SharePoint are deleted or modified. If we need to store any secrets or API keys, we need to configure and consume them from Azure Key Vault. We are an Azure enterprise, so when this application is ready for deployment, it will need to be deployed to an Azure PaaS solution for hosting. The application logic should always take into account OWASP best practices for web application security.

SHAREPOINT RESOURCES:

Project Tracker: https://mwdsocal.sharepoint.com/teams/CSUMANAGERS/Lists/query%2024187b54fb7664efc99b432799457cee3/AllItems.aspx?e=LwgQ4v&CID=e9c33a16%2Dc546%2D48ae%2Da478%2D936dba902454
Example Shift Report Form: https://mwdsocal.sharepoint.com/teams/WSO-CSU-WesternTeam/_layouts/15/listforms.aspx?cid=NmY5YmQ3ODMtMDAwMS00ODQ1LTlmZmItZGQ2NmE1N2E3ZWFh&nav=NjkyNGY1YTYtOGIwNS00YWUzLWJhZjQtNjA0NWQ2MTVlYmIz

DESIRED APPLICATION FLOW:
When a user hits the URL, they will be challenged to authenticate with our enterprise identity provider, EntraID, which is also integrated with Workspace One and Yubikey (if on a device not registered with WS1).

After authentication, the user will be presented with a series of dropdowns to select the project they are working on, the shift they are working, and the date they are working on. It will pull the description of the work from the Project Tracker SharePoint list for the matching project. 

It will have fields for a series of freeform text entries, which will be formatted into single line bullets on the report (these are the details for the work in the reporting period).

It will allow for photo uploads which it will include in the report and format automatically for proper size and spacing in the final report. It will also allow for captions for each photo at the time of upload. 

Once all the required information has been provided, there will be a button to generate the report. The report will be generated in a PDF format and will be saved to the user's device. The "CSU_Logo_BBY" image should be included in the header of the report.




