---
author: jandersen
comments: true
date: 2007-07-30 16:20:35+00:00
layout: post
slug: use-xsl-to-create-advanced-office-docs-from-a-webapp
title: Use XSL To Create Advanced Office Docs from a Webapp
wordpress_id: 16
tags:
- XML
- XSL
- MS Office
---

Creating Office documents--spreadsheets (Excel), or printable word processing documents (Word), etc--with some kind of dynamic data seems to be a fairly common user requirement for applications, web or otherwise.  On the web, creating these documents can be a little tricky.  It helps that Word, Excel and others can actually read HTML so without too much trouble you can send a response back with the `Content-Type` header set to `"application/msword"` and then just output html and it will open in Word.  However, HTML only takes you so far, what if you need to take advantage of some of the more advanced features available in the target application?

I recently worked on a web application which needed to deliver a printable version of a somewhat complex MS Word form.  The form was actually the legacy hardcopy form that the web application was working to replace but for interface with some other internal groups I needed to dynamically produce a copy of the legacy form that would be automatically completed with data gathered through the web.

In this case the form was pretty complex and printing was going to be an important factor so I wasn't sure I wanted the browser to be handling my printing for me.  I've since used a similar approach to produce dynamic Visio org charts over the web...  Munging through [Office XML document formats](http://msdn.microsoft.com/en-us/library/aa338205(v=office.12).aspx) to create XSL stylesheets probably isn't cost/work justified when HTML is a valid option but it's works fairly well when creating documents that will take advantage of advanced features of the office document formats (e.g. org charts in Visio, cell protection in Excel, ...).  I haven't tried this with the [OpenDocument formats](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=office) but the priniciple should be about the same.

OK, so here's the basic approach:
1.  Define a simple XML structure in which the dynamic parts of the document will reside and write whatever code is necessary to produce that XML when needed.
1.  Use the applicable Office application to create the target document.  In my case, I was given the existing MS Word document representing the hardcopy form.
2.  Save the form as an XML Document.  For the MS Office suite I believe this is supported for Office 2003 and above.  NOTE: Your users will need to have an office suite supporting the Office XML format in order to make use of this technique!
3.  Now Create an XSL stylesheet based on the XML Document
    - Start by pasting the entire XML version of the document in to the root processing template
    - Find the parts of the document where dynamic data should be inserted and replace those sections with [`xsl:value-of`](http://msdn.microsoft.com/en-us/library/ms256181.aspx) tags or addtional processing templates called by [`xsl:apply-templates`](http://msdn.microsoft.com/en-us/library/ms256184.aspx) tags to sub in data from your source XML document.
4.  Produce your source XML that represents the dynamic data to be formatted as an Office document
5.  Transform the source XML into an office document in XML format using your stylesheet
6.  *(Optional)* If you're working on the web you'll most likely want to stream the result of the [`XslCompiledTransform`](http://msdn.microsoft.com/en-us/library/system.xml.xsl.xslcompiledtransform.aspx) directly back to the HTTP response after setting the appropriate headers:

{% highlight aspx-vb %} 
Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
    If Request("generate") = "true" Then
        'Prep the response
        Response.Clear()
        Response.ContentType = "application/x-visio"
        'Response.AddHeader("Content-Disposition", "inline;filename=orgchart-test.vdx")
        Response.AddHeader("Content-Disposition", "attachment;filename=orgchart-test.vdx")

        'Load XSL
        Dim xslt As New XslCompiledTransform
        xslt.Load(Server.MapPath("VisioOrgChart.xslt"))

        'Load XML data
        Dim xml As XmlReader = XmlReader.Create(Server.MapPath("OrgChartSample.xml"))
        Dim writer As XmlWriter = XmlWriter.Create(Response.Output, xslt.OutputSettings)

        'Transform XML to DataDiagramML for Visio
        xslt.Transform(xml, Nothing, writer, New XmlUrlResolver)
        Response.End()
    End If
End Sub
{% endhighlight %}