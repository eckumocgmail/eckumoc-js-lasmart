#pragma checksum "D:\Projects-GitHub\eckumoc-js-lasmart\Views\Points\Diagram.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4506980cb56d90bd6ac505eafb1cdc2b6019e1f7"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Points_Diagram), @"mvc.1.0.view", @"/Views/Points/Diagram.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\Projects-GitHub\eckumoc-js-lasmart\Views\_ViewImports.cshtml"
using eckumoc_js_lasmart;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Projects-GitHub\eckumoc-js-lasmart\Views\_ViewImports.cshtml"
using eckumoc_js_lasmart.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"4506980cb56d90bd6ac505eafb1cdc2b6019e1f7", @"/Views/Points/Diagram.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"4e74e82c6f853af0238657787e7d410b3edf4f36", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Points_Diagram : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    #nullable disable
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "D:\Projects-GitHub\eckumoc-js-lasmart\Views\Points\Diagram.cshtml"
  
    ViewData["Title"] = "Home Page";

#line default
#line hidden
#nullable disable
            WriteLiteral(@"

<div class=""card"" ng-app=""PointsDiagramApp"" ng-controller=""PointsDiagramController"">
    <div class=""card-header"">
        <h2>Диаграмма</h2>
        <div style=""padding: 10px;"">
            <span class=""btn btn-sm btn-primary"" ng-click=""createDialog()"">добавить</span>
        </div>
    </div>
    <div class=""card-body"">
        <div class=""container-fluid"">
            <div class=""row"">
                <div class=""col-8"">
                    <div id=""container"" style=""border: 1px solid black;""></div>
                </div>
                <div class=""col-4"">                    
                    <div ng-init=""createModel={x: 10, y: 50, r: 30, color: 'green'}"">
                        <div class=""card"" ng-hide=""isCreateDialog==false"" >
                            <div class=""card-header"" "">
                                <b>Новый элемент</b>
                                {{createModel}}
                            </div>
                            <div class=""card-body"" >
     ");
            WriteLiteral(@"                           <div class=""form-inline"">
                                  <div class=""form-group"" >
                                    <label for=""x"">x</label>
                                    <input type=""number"" class=""form-control"" ng-model=""createModel.x"" id=""x"" aria-describedby=""x"" >
                                    <small class=""form-text text-muted"" hidden>We'll never share your email with anyone else.</small>
                                  </div>
                                  <div class=""form-group"">
                                    <label for=""Y"">Y</label>
                                    <input type=""number"" class=""form-control"" ng-model=""createModel.y"" id=""y"" aria-describedby=""y"" >
                                    <small class=""form-text text-muted"" hidden>We'll never share your email with anyone else.</small>
                                  </div>
                                  <div class=""form-group"">
                                    <label ");
            WriteLiteral(@"for=""r"">r</label>
                                    <input type=""number"" class=""form-control"" ng-model=""createModel.r"" id=""r"" aria-describedby=""r"" >
                                    <small class=""form-text text-muted"" hidden>We'll never share your email with anyone else.</small>
                                  </div>    
                                  <div class=""form-group"">
                                    <label for=""color"">color</label>
                                    <input type=""color"" class=""form-control"" ng-model=""createModel.color"" id=""color"" aria-describedby=""color"" >
                                    <small class=""form-text text-muted"" hidden>We'll never share your email with anyone else.</small>
                                  </div>   
                              </div>
                              <div class=""form-group"" style=""padding: 10px;"">
                                <span class=""btn btn-sm btn-primary"" ng-click=""createPoint()"">сохранить</span>
      ");
            WriteLiteral(@"                          <span class=""btn btn-sm btn-primary"" ng-click=""hideEditor()"">отмена</span>
                              </div>
                            </div>
                        </div>
                    </div>
                    <ul class=""list-group"" id=""comments""></ul>
                </div>
            </div>
        </div>
    </div>
</div> 
 
");
        }
        #pragma warning restore 1998
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
