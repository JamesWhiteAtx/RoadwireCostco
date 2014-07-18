using System.Web;
using System.Configuration;
using System.Web.Configuration;

namespace RoadwireCostco
{
    public class NetSuiteConfiguration : ConfigurationSection
    {
        public static readonly string ConfigSectionName = "NetSuiteSection";

        ConfigurationProperty _Uri;

        public NetSuiteConfiguration()
        {
            _Uri = new ConfigurationProperty("Uri", typeof(UriElement), null);

            this.Properties.Add(_Uri);
        }

        public UriElement Uri
        {
            get { return this[_Uri] as UriElement; }
            set { this[_Uri] = value; }
        }
    }

    public interface INetSuiteConfigService
    {
        string Scheme { get; set; }
        string SysHost { get; set; }
        string FormsHost { get; set; }
        string RestHost { get; set; }
        string ScriptPath { get; set; }
        string RestPath { get; set; }
        string CustRecPath { get; set; }
        string ItemPath { get; set; }

        string SelHVal { get; set; }
        string SelScriptVal { get; set; }
        string SelDeployVal { get; set; }
        string CcOrderScriptVal { get; set; }
        string CcOrderDeployVal { get; set; }
        string FileHVal { get; set; }
        string FileScriptVal { get; set; }
        string FileDeployVal { get; set; }

        string CompidVal { get; set; }
        string EmailVal { get; set; }
        string PassVal { get; set; }

        bool DebugVal { get; set; }
        string DebugCookieVal { get; set; }

        string MakeCustRecId { get; set; }
        string ModelCustRecId { get; set; }
        string BodyCustRecId { get; set; }
        string TrimCustRecId { get; set; }
        string CarCustRecId { get; set; }
        string PatternCustRecId { get; set; }
    }

    public class UriElement : ConfigurationElement, INetSuiteConfigService
    {
        public UriElement()
        {
            _Scheme = new ConfigurationProperty("scheme", typeof(string), "<UNDEFINED>");
            _SysHost = new ConfigurationProperty("sysHost", typeof(string), "<UNDEFINED>");
            _FormsHost = new ConfigurationProperty("formsHost", typeof(string), "<UNDEFINED>");
            _RestHost = new ConfigurationProperty("restHost", typeof(string), "<UNDEFINED>");
            _ScriptPath = new ConfigurationProperty("scriptPath", typeof(string), "<UNDEFINED>");
            _RestPath = new ConfigurationProperty("restPath", typeof(string), "<UNDEFINED>");
            _CustRecPath = new ConfigurationProperty("custRecPath", typeof(string), "<UNDEFINED>");
            _ItemPath = new ConfigurationProperty("itemPath", typeof(string), "<UNDEFINED>");
            _CompidVal = new ConfigurationProperty("compidVal", typeof(string), "<UNDEFINED>");
            _EmailVal = new ConfigurationProperty("emailVal", typeof(string), "<UNDEFINED>");
            _PassVal = new ConfigurationProperty("passVal", typeof(string), "<UNDEFINED>");

            //_DebugVal = new ConfigurationProperty("debugVal", typeof(bool), "<UNDEFINED>");
            _DebugVal = new ConfigurationProperty("debugVal", typeof(bool), null, ConfigurationPropertyOptions.None);
            _DebugCookieVal = new ConfigurationProperty("debugCookieVal", typeof(string), "<UNDEFINED>");

            _SelHVal = new ConfigurationProperty("selHVal", typeof(string), "<UNDEFINED>");

            _SelScriptVal = new ConfigurationProperty("selScriptVal", typeof(string), "<UNDEFINED>");
            _SelDeployVal = new ConfigurationProperty("selDeployVal", typeof(string), "<UNDEFINED>");
            _CcOrderScriptVal = new ConfigurationProperty("ccOrderScriptVal", typeof(string), "<UNDEFINED>");
            _CcOrderDeployVal = new ConfigurationProperty("ccOrderDeployVal", typeof(string), "<UNDEFINED>");
            _FileHVal = new ConfigurationProperty("fileHVal", typeof(string), "<UNDEFINED>");
            _FileScriptVal = new ConfigurationProperty("fileScriptVal", typeof(string), "<UNDEFINED>");
            _FileDeployVal = new ConfigurationProperty("fileDeployVal", typeof(string), "<UNDEFINED>");

            _MakeCustRecId = new ConfigurationProperty("makeCustRecId", typeof(string), "<UNDEFINED>");
            _ModelCustRecId = new ConfigurationProperty("modelCustRecId", typeof(string), "<UNDEFINED>");
            _BodyCustRecId = new ConfigurationProperty("bodyCustRecId", typeof(string), "<UNDEFINED>");
            _TrimCustRecId = new ConfigurationProperty("trimCustRecId", typeof(string), "<UNDEFINED>");
            _CarCustRecId = new ConfigurationProperty("carCustRecId", typeof(string), "<UNDEFINED>");
            _PatternCustRecId = new ConfigurationProperty("patternCustRecId", typeof(string), "<UNDEFINED>");

            this.Properties.Add(_Scheme);
            this.Properties.Add(_SysHost);
            this.Properties.Add(_FormsHost);
            this.Properties.Add(_RestHost);
            this.Properties.Add(_ScriptPath);
            this.Properties.Add(_RestPath);
            this.Properties.Add(_CustRecPath);
            this.Properties.Add(_ItemPath);
            this.Properties.Add(_SelHVal);
            this.Properties.Add(_SelScriptVal);
            this.Properties.Add(_SelDeployVal);
            this.Properties.Add(_CcOrderScriptVal);
            this.Properties.Add(_CcOrderDeployVal);
            this.Properties.Add(_FileHVal);
            this.Properties.Add(_FileScriptVal);
            this.Properties.Add(_FileDeployVal);
            this.Properties.Add(_CompidVal);
            this.Properties.Add(_EmailVal);
            this.Properties.Add(_PassVal);

            this.Properties.Add(_DebugVal);
            this.Properties.Add(_DebugCookieVal);
            
            this.Properties.Add(_MakeCustRecId);
            this.Properties.Add(_ModelCustRecId);
            this.Properties.Add(_BodyCustRecId);
            this.Properties.Add(_TrimCustRecId);
            this.Properties.Add(_CarCustRecId);
            this.Properties.Add(_PatternCustRecId);
        }

        ConfigurationProperty _Scheme; 
        public string Scheme { get { return (string)this[_Scheme]; } set { this[_Scheme] = value; } }

        ConfigurationProperty _SysHost;
        public string SysHost { get { return (string)this[_SysHost]; } set { this[_SysHost] = value; } }

        ConfigurationProperty _FormsHost; 
        public string FormsHost { get { return (string)this[_FormsHost]; } set { this[_FormsHost] = value; } }

        ConfigurationProperty _RestHost;
        public string RestHost { get { return (string)this[_RestHost]; } set { this[_RestHost] = value; } }

        ConfigurationProperty _ScriptPath; 
        public string ScriptPath { get { return (string)this[_ScriptPath]; } set { this[_ScriptPath] = value; } }

        ConfigurationProperty _RestPath;
        public string RestPath { get { return (string)this[_RestPath]; } set { this[_RestPath] = value; } }

        ConfigurationProperty _CustRecPath; 
        public string CustRecPath { get { return (string)this[_CustRecPath]; } set { this[_CustRecPath] = value; } }
        
        ConfigurationProperty _ItemPath; 
        public string ItemPath { get { return (string)this[_ItemPath]; } set { this[_ItemPath] = value; } }
        
        ConfigurationProperty _CompidVal; 
        public string CompidVal { get { return (string)this[_CompidVal]; } set { this[_CompidVal] = value; } }
        
        ConfigurationProperty _EmailVal;
        public string EmailVal { get { return (string)this[_EmailVal]; } set { this[_EmailVal] = value; } }
        
        ConfigurationProperty _PassVal;
        public string PassVal { get { return (string)this[_PassVal]; } set { this[_PassVal] = value; } }

        ConfigurationProperty _DebugVal;
        public bool DebugVal { get { return (bool)this[_DebugVal]; } set { this[_DebugVal] = value; } }

        ConfigurationProperty _DebugCookieVal;
        public string DebugCookieVal { get { return (string)this[_DebugCookieVal]; } set { this[_DebugCookieVal] = value; } }

        ConfigurationProperty _SelHVal;
        public string SelHVal { get { return (string)this[_SelHVal]; } set { this[_SelHVal] = value; } }
        
        ConfigurationProperty _SelScriptVal;
        public string SelScriptVal { get { return (string)this[_SelScriptVal]; } set { this[_SelScriptVal] = value; } }

        ConfigurationProperty _SelDeployVal;
        public string SelDeployVal { get { return (string)this[_SelDeployVal]; } set { this[_SelDeployVal] = value; } }

        ConfigurationProperty _CcOrderScriptVal;
        public string CcOrderScriptVal { get { return (string)this[_CcOrderScriptVal]; } set { this[_CcOrderScriptVal] = value; } }

        ConfigurationProperty _CcOrderDeployVal;
        public string CcOrderDeployVal { get { return (string)this[_CcOrderDeployVal]; } set { this[_CcOrderDeployVal] = value; } }

        ConfigurationProperty _FileHVal;
        public string FileHVal { get { return (string)this[_FileHVal]; } set { this[_FileHVal] = value; } }

        ConfigurationProperty _FileScriptVal;
        public string FileScriptVal { get { return (string)this[_FileScriptVal]; } set { this[_FileScriptVal] = value; } }

        ConfigurationProperty _FileDeployVal;
        public string FileDeployVal { get { return (string)this[_FileDeployVal]; } set { this[_FileDeployVal] = value; } }

        ConfigurationProperty _MakeCustRecId;
        public string MakeCustRecId { get { return (string)this[_MakeCustRecId]; } set { this[_MakeCustRecId] = value; } }

        ConfigurationProperty _ModelCustRecId;
        public string ModelCustRecId { get { return (string)this[_ModelCustRecId]; } set { this[_ModelCustRecId] = value; } }

        ConfigurationProperty _BodyCustRecId;
        public string BodyCustRecId { get { return (string)this[_BodyCustRecId]; } set { this[_BodyCustRecId] = value; } }
        
        ConfigurationProperty _TrimCustRecId;
        public string TrimCustRecId { get { return (string)this[_TrimCustRecId]; } set { this[_TrimCustRecId] = value; } }

        ConfigurationProperty _CarCustRecId;
        public string CarCustRecId { get { return (string)this[_CarCustRecId]; } set { this[_CarCustRecId] = value; } }

        ConfigurationProperty _PatternCustRecId;
        public string PatternCustRecId { get { return (string)this[_PatternCustRecId]; } set { this[_PatternCustRecId] = value; } }
    }

}