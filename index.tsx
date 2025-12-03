import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  User,
  Calendar,
  Download,
  Edit2,
  Check,
  Plus,
  Trash2,
  X,
  Upload,
  Layout,
  Palette,
  Github,
  Globe,
  FileJson,
  UploadCloud,
  Save,
  LogOut
} from "lucide-react";

// --- Types & Initial Data ---

const THEME_COLORS = {
  blue: "blue",
  emerald: "emerald",
  violet: "violet",
  slate: "slate",
  rose: "rose"
};

const TEMPLATES = {
  modern: "modern",
  classic: "classic"
};

// Placeholder data for public repository
const initialResumeData = {
  basics: {
    name: "您的姓名",
    title: "求职意向 / 职位头衔",
    phone: "138-xxxx-xxxx",
    email: "example@email.com",
    location: "意向城市",
    salary: "期望薪资",
    experience: "年龄 | 经验",
    summary: "这里是您的个人简介。请简要描述您的专业背景、核心技能以及职业目标。例如：具有X年开发经验，熟悉React与Node.js，善于解决复杂问题，具备良好的团队协作能力，对新技术保持敏锐的洞察力。",
    avatar: "" // Base64 string for avatar
  },
  education: [
    {
      institution: "毕业院校名称",
      major: "主修专业",
      degree: "学历/学位",
      start: "20xx",
      end: "20xx"
    }
  ],
  skills: {
    languages: ["Java", "C++", "Python", "JavaScript", "TypeScript"],
    frontend: ["React", "Vue", "Android", "Flutter", "iOS"],
    backend: ["Node.js", "MySQL", "Redis", "Docker"],
    hardware: ["Arduino", "Raspberry Pi", "IoT Sensors"],
    others: ["Git", "Linux", "Agile", "CI/CD"]
  },
  certificates: [
    "证书名称示例 1 (例如：CET-6)",
    "证书名称示例 2 (例如：PMP认证)",
    "证书名称示例 3",
    "相关技能证书 A",
    "相关技能证书 B"
  ],
  projects: [
    {
      name: "项目名称示例 A",
      role: "负责人/开发者",
      date: "20xx.xx - 20xx.xx",
      desc: "简要描述项目的核心功能、目标以及您在其中发挥的作用。",
      details: [
        "负责的具体工作内容描述，使用了什么技术解决了什么问题。",
        "实现了某某核心模块，提升了系统性能xx%。",
        "优化了用户体验，主导了技术选型与架构设计。"
      ]
    },
    {
      name: "项目名称示例 B",
      role: "核心成员",
      date: "20xx.xx - 20xx.xx",
      desc: "另一个项目的简要描述。",
      details: [
        "参与了模块的需求分析与编码工作。",
        "配合团队完成了系统的测试与上线。",
        "编写了自动化脚本，提高了开发效率。"
      ]
    },
    {
      name: "个人开源项目",
      role: "独立开发",
      date: "20xx.xx",
      desc: "基于某某技术栈开发的个人兴趣项目。",
      details: [
        "项目亮点功能介绍一。",
        "项目亮点功能介绍二。"
      ]
    }
  ]
};

// --- Helper Components ---

const EditableField = ({ 
  value, 
  onChange, 
  isEditing, 
  className = "", 
  placeholder = "", 
  multiline = false,
  darkTheme = false 
}) => {
  if (!isEditing) {
    return <span className={`${className} whitespace-pre-wrap`}>{value}</span>;
  }

  const baseInputStyles = `w-full bg-opacity-20 transition-colors duration-200 outline-none p-1 rounded ${
    darkTheme 
      ? "bg-white/10 text-white border-b border-white/30 placeholder-white/30 focus:bg-white/20" 
      : "bg-black/5 text-slate-800 border-b border-black/20 placeholder-black/30 focus:bg-black/10"
  }`;

  if (multiline) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInputStyles} ${className} min-h-[4em] resize-y`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseInputStyles} ${className}`}
      placeholder={placeholder}
    />
  );
};

const SectionControls = ({ onAdd, label, isEditing, darkTheme = false }) => {
  if (!isEditing) return null;
  return (
    <button 
      onClick={onAdd}
      className={`mt-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded border border-dashed transition-all opacity-60 hover:opacity-100 ${
        darkTheme 
          ? "border-white/30 text-white/50 hover:text-white hover:border-white" 
          : "border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-600"
      }`}
    >
      <Plus size={14} /> 添加{label}
    </button>
  );
};

const DeleteButton = ({ onClick, className = "absolute -left-8 top-0" }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`${className} p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10`}
    title="删除此项"
  >
    <Trash2 size={16} />
  </button>
);

const AvatarUpload = ({ avatar, onChange, isEditing, name }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group shrink-0">
      <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg flex items-center justify-center bg-slate-800 text-white text-3xl font-bold relative ${isEditing ? 'cursor-pointer hover:border-blue-400' : ''}`}
           onClick={() => isEditing && fileInputRef.current?.click()}>
        {avatar ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{name?.[0] || "Me"}</span>
        )}
        
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload className="text-white w-8 h-8" />
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

// --- Templates ---

// 1. Modern Sidebar Template
const ModernTemplate = ({ resume, isEditing, updateBasic, updateEducation, updateSkills, updateCertificate, updateProject, updateProjectDetail, addEducation, removeEducation, addSkill, removeSkill, addCertificate, removeCertificate, addProject, removeProject, addProjectDetail, removeProjectDetail, themeColor }) => {
  const bgColors = {
    blue: "bg-slate-900",
    emerald: "bg-emerald-900",
    violet: "bg-violet-950",
    slate: "bg-slate-800",
    rose: "bg-rose-950"
  };
  
  const accentColors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    slate: "text-slate-400",
    rose: "text-rose-400"
  };

  const sidebarBg = bgColors[themeColor] || bgColors.blue;
  const accentText = accentColors[themeColor] || accentColors.blue;

  return (
    <div className="flex flex-col md:flex-row print:flex-row h-full min-h-[297mm]">
      {/* Left Sidebar */}
      <div className={`w-full md:w-1/3 print:w-1/3 ${sidebarBg} text-slate-300 p-8 flex flex-col gap-8 print:h-full`}>
        {/* Header Profile Section */}
        <div className="text-center md:text-left space-y-4 flex flex-col items-center md:items-start">
          <AvatarUpload 
            avatar={resume.basics.avatar} 
            name={resume.basics.name} 
            onChange={(v) => updateBasic("avatar", v)} 
            isEditing={isEditing} 
          />
          
          <div className="space-y-2 w-full">
            <EditableField 
              value={resume.basics.name} 
              onChange={(v) => updateBasic("name", v)} 
              isEditing={isEditing} 
              darkTheme={true}
              className="text-3xl font-bold text-white tracking-wide block"
              placeholder="姓名"
            />
            <EditableField 
              value={resume.basics.title} 
              onChange={(v) => updateBasic("title", v)} 
              isEditing={isEditing} 
              darkTheme={true}
              className={`${accentText} font-medium text-lg block`}
              placeholder="职位头衔"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-sm mt-2 justify-center md:justify-start items-center w-full">
            <EditableField 
              value={resume.basics.experience} 
              onChange={(v) => updateBasic("experience", v)} 
              isEditing={isEditing} 
              darkTheme={true}
              className="min-w-[60px]"
              placeholder="年龄/性别"
            />
            <span>|</span>
            <div className="flex items-center gap-1">
              <span className="shrink-0 text-white/60">期望薪资:</span>
              <EditableField 
                value={resume.basics.salary} 
                onChange={(v) => updateBasic("salary", v)} 
                isEditing={isEditing} 
                darkTheme={true}
                className="min-w-[60px]"
                placeholder="薪资范围"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 my-2"></div>

        {/* Contact Info */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Phone className={`w-4 h-4 ${accentText} shrink-0`} />
            <EditableField 
              value={resume.basics.phone} 
              onChange={(v) => updateBasic("phone", v)} 
              isEditing={isEditing} 
              darkTheme={true}
              placeholder="电话号码"
            />
          </div>
          <div className="flex items-center gap-3">
            <Mail className={`w-4 h-4 ${accentText} shrink-0`} />
            <EditableField 
              value={resume.basics.email} 
              onChange={(v) => updateBasic("email", v)} 
              isEditing={isEditing} 
              darkTheme={true}
              placeholder="电子邮箱"
            />
          </div>
          <div className="flex items-center gap-3">
            <MapPin className={`w-4 h-4 ${accentText} shrink-0`} />
            <div className="flex gap-1 w-full">
              <span className="shrink-0">期望城市：</span>
              <EditableField 
                value={resume.basics.location} 
                onChange={(v) => updateBasic("location", v)} 
                isEditing={isEditing} 
                darkTheme={true}
                placeholder="城市"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="relative group/section">
          <h2 className={`text-white text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2`}>
            <GraduationCap className={`w-5 h-5 ${accentText}`} />
            教育经历
          </h2>
          <div className="space-y-6">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="space-y-1 relative group/item hover:bg-white/5 p-2 -m-2 rounded transition-colors">
                {isEditing && <DeleteButton onClick={() => removeEducation(idx)} className="absolute top-2 right-2" />}
                <EditableField 
                  value={edu.institution} 
                  onChange={(v) => updateEducation(idx, "institution", v)} 
                  isEditing={isEditing} 
                  darkTheme={true}
                  className="text-white font-medium block"
                  placeholder="学校名称"
                />
                <div className="flex gap-2 text-slate-400 text-sm">
                  <EditableField 
                    value={edu.major} 
                    onChange={(v) => updateEducation(idx, "major", v)} 
                    isEditing={isEditing} 
                    darkTheme={true}
                    placeholder="专业"
                  />
                  <span>|</span>
                  <EditableField 
                    value={edu.degree} 
                    onChange={(v) => updateEducation(idx, "degree", v)} 
                    isEditing={isEditing} 
                    darkTheme={true}
                    placeholder="学历"
                  />
                </div>
                <div className="flex gap-1 text-slate-500 text-xs">
                  <EditableField 
                    value={edu.start} 
                    onChange={(v) => updateEducation(idx, "start", v)} 
                    isEditing={isEditing} 
                    darkTheme={true}
                    placeholder="开始"
                  />
                  <span>-</span>
                  <EditableField 
                    value={edu.end} 
                    onChange={(v) => updateEducation(idx, "end", v)} 
                    isEditing={isEditing} 
                    darkTheme={true}
                    placeholder="结束"
                  />
                </div>
              </div>
            ))}
          </div>
          <SectionControls onAdd={addEducation} label="教育经历" isEditing={isEditing} darkTheme={true} />
        </div>

        {/* Skills */}
        <div>
          <h2 className={`text-white text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2`}>
            <Code className={`w-5 h-5 ${accentText}`} />
            专业技能
          </h2>
          <div className="space-y-4 text-sm">
            {[
              { key: "languages", label: "开发语言" },
              { key: "frontend", label: "前端/移动端" },
              { key: "backend", label: "后端/数据库" },
              { key: "hardware", label: "硬件/嵌入式" }
            ].map((cat) => (
              <div key={cat.key} className="relative group/section">
                <span className={`${accentText} font-semibold block mb-1`}>{cat.label}</span>
                <div className="flex flex-wrap gap-1">
                  {resume.skills[cat.key].map((skill, idx) => (
                    <div key={idx} className="relative group/item flex items-center bg-white/5 rounded px-2 py-0.5">
                      <EditableField 
                        value={skill} 
                        onChange={(v) => updateSkills(cat.key, idx, v)} 
                        isEditing={isEditing} 
                        darkTheme={true}
                        className="mr-1"
                      />
                       {isEditing && (
                         <span className="text-slate-500 cursor-pointer hover:text-red-400 ml-1" onClick={() => removeSkill(cat.key, idx)}><X size={12}/></span>
                       )}
                    </div>
                  ))}
                </div>
                <SectionControls onAdd={() => addSkill(cat.key)} label="技能" isEditing={isEditing} darkTheme={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="relative group/section">
          <h2 className={`text-white text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2`}>
            <Award className={`w-5 h-5 ${accentText}`} />
            资格证书
          </h2>
          <ul className="text-sm space-y-2 text-slate-300">
            {resume.certificates.map((cert, idx) => (
              <li key={idx} className="relative group/item flex items-start gap-2">
                 {isEditing ? (
                   <div className="flex items-center w-full gap-2">
                     <button onClick={() => removeCertificate(idx)} className="text-red-400 hover:text-red-500 shrink-0"><X size={14}/></button>
                     <EditableField 
                      value={cert} 
                      onChange={(v) => updateCertificate(idx, v)} 
                      isEditing={isEditing} 
                      darkTheme={true}
                      className="w-full"
                    />
                   </div>
                 ) : (
                   <>
                    <span className={`${accentText} mt-1`}>•</span>
                    <span>{cert}</span>
                   </>
                 )}
              </li>
            ))}
          </ul>
          <SectionControls onAdd={addCertificate} label="证书" isEditing={isEditing} darkTheme={true} />
        </div>
      </div>

      {/* Right Main Content */}
      <div className="w-full md:w-2/3 print:w-2/3 p-8 md:p-12 text-slate-800 print:p-8 bg-white">
        
        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-slate-700" />
            个人优势
          </h2>
          <EditableField 
            value={resume.basics.summary} 
            onChange={(v) => updateBasic("summary", v)} 
            isEditing={isEditing} 
            multiline={true}
            className="leading-relaxed text-slate-600 text-sm text-justify w-full"
            placeholder="请填写个人简介..."
          />
        </section>

        {/* Experience / Projects */}
        <section className="relative group/section">
          <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-slate-700" />
            项目经历
          </h2>
          
          <div className="space-y-8">
            {isEditing && (
               <button 
                onClick={addProject}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={20} /> 添加新项目
              </button>
            )}

            {resume.projects.map((project, idx) => (
              <div key={idx} className="break-inside-avoid relative group/item transition-all p-2 -m-2 rounded hover:bg-slate-50">
                {isEditing && (
                  <div className="absolute right-0 top-0 flex gap-2">
                    <button 
                      onClick={() => removeProject(idx)}
                      className="p-2 bg-white text-red-500 border border-red-200 rounded-full shadow-sm hover:bg-red-50"
                      title="删除项目"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 gap-2">
                  <EditableField 
                    value={project.name} 
                    onChange={(v) => updateProject(idx, "name", v)} 
                    isEditing={isEditing} 
                    className="text-lg font-bold text-slate-800"
                    placeholder="项目名称"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
                    <div className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      <EditableField 
                        value={project.role} 
                        onChange={(v) => updateProject(idx, "role", v)} 
                        isEditing={isEditing} 
                        placeholder="角色"
                        className="text-center min-w-[40px]"
                      />
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar size={12}/> 
                      <EditableField 
                        value={project.date} 
                        onChange={(v) => updateProject(idx, "date", v)} 
                        isEditing={isEditing} 
                        placeholder="时间段"
                        className="min-w-[100px]"
                      />
                    </span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <EditableField 
                    value={project.desc} 
                    onChange={(v) => updateProject(idx, "desc", v)} 
                    isEditing={isEditing} 
                    multiline={true}
                    className="text-sm font-medium text-slate-700 w-full"
                    placeholder="项目简述"
                  />
                </div>
                
                {/* Project Details List */}
                {project.details && (
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                    {project.details.map((detail, dIdx) => (
                      <li key={dIdx} className="pl-1 relative group/detail">
                        <div className="flex items-start gap-2">
                           {isEditing && (
                             <button onClick={() => removeProjectDetail(idx, dIdx)} className="text-red-400 mt-1 hover:text-red-600 shrink-0"><X size={12}/></button>
                           )}
                           <EditableField 
                              value={detail} 
                              onChange={(v) => updateProjectDetail(idx, dIdx, v)} 
                              isEditing={isEditing} 
                              multiline={true}
                              className="w-full"
                              placeholder="详细条目"
                            />
                        </div>
                      </li>
                    ))}
                    {isEditing && (
                       <li className="list-none -ml-4 mt-2">
                         <button onClick={() => addProjectDetail(idx)} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                           <Plus size={12} /> 添加详情
                         </button>
                       </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// 2. Classic Professional Template
const ClassicTemplate = ({ resume, isEditing, updateBasic, updateEducation, updateSkills, updateCertificate, updateProject, updateProjectDetail, addEducation, removeEducation, addSkill, removeSkill, addCertificate, removeCertificate, addProject, removeProject, addProjectDetail, removeProjectDetail, themeColor }) => {
  const textColors = {
    blue: "text-blue-800",
    emerald: "text-emerald-800",
    violet: "text-violet-800",
    slate: "text-slate-800",
    rose: "text-rose-800"
  };
  const borderColors = {
    blue: "border-blue-800",
    emerald: "border-emerald-800",
    violet: "border-violet-800",
    slate: "border-slate-800",
    rose: "border-rose-800"
  };

  const themeText = textColors[themeColor] || textColors.blue;
  const themeBorder = borderColors[themeColor] || borderColors.blue;

  return (
    <div className="p-12 h-full min-h-[297mm] bg-white text-slate-800 flex flex-col gap-6">
      
      {/* Header */}
      <header className={`border-b-4 ${themeBorder} pb-6 flex items-center gap-6`}>
        <AvatarUpload 
          avatar={resume.basics.avatar} 
          name={resume.basics.name} 
          onChange={(v) => updateBasic("avatar", v)} 
          isEditing={isEditing} 
        />
        <div className="flex-1">
          <EditableField 
            value={resume.basics.name} 
            onChange={(v) => updateBasic("name", v)} 
            isEditing={isEditing} 
            className={`text-4xl font-bold ${themeText} uppercase tracking-wider mb-2 block`}
            placeholder="姓名"
          />
          <EditableField 
            value={resume.basics.title} 
            onChange={(v) => updateBasic("title", v)} 
            isEditing={isEditing} 
            className="text-xl text-slate-600 font-medium block mb-3"
            placeholder="职位"
          />
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
               <Phone size={14} />
               <EditableField value={resume.basics.phone} onChange={(v) => updateBasic("phone", v)} isEditing={isEditing} placeholder="电话" />
            </div>
            <div className="flex items-center gap-2">
               <Mail size={14} />
               <EditableField value={resume.basics.email} onChange={(v) => updateBasic("email", v)} isEditing={isEditing} placeholder="邮箱" />
            </div>
             <div className="flex items-center gap-2">
               <MapPin size={14} />
               <EditableField value={resume.basics.location} onChange={(v) => updateBasic("location", v)} isEditing={isEditing} placeholder="地点" />
            </div>
             <div className="flex items-center gap-2">
               <span className="font-semibold">期望薪资:</span>
               <EditableField value={resume.basics.salary} onChange={(v) => updateBasic("salary", v)} isEditing={isEditing} placeholder="薪资" />
            </div>
             <div className="flex items-center gap-2">
               <User size={14} />
               <EditableField value={resume.basics.experience} onChange={(v) => updateBasic("experience", v)} isEditing={isEditing} placeholder="经验" />
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section>
        <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-3 pb-1`}>个人优势</h3>
        <EditableField 
          value={resume.basics.summary} 
          onChange={(v) => updateBasic("summary", v)} 
          isEditing={isEditing} 
          multiline={true}
          className="text-slate-700 leading-relaxed text-sm"
          placeholder="个人简介..."
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 print:col-span-2 space-y-6">
           {/* Experience */}
           <section>
              <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-4 pb-1 flex justify-between items-center`}>
                项目经历
                <SectionControls onAdd={addProject} label="项目" isEditing={isEditing} />
              </h3>
              <div className="space-y-6">
                {resume.projects.map((project, idx) => (
                  <div key={idx} className="relative group/item break-inside-avoid">
                    {isEditing && <DeleteButton onClick={() => removeProject(idx)} className="absolute -right-8 top-0" />}
                    <div className="flex justify-between items-baseline mb-1">
                      <EditableField value={project.name} onChange={(v) => updateProject(idx, "name", v)} isEditing={isEditing} className="font-bold text-slate-800 text-lg" placeholder="项目名称" />
                      <EditableField value={project.date} onChange={(v) => updateProject(idx, "date", v)} isEditing={isEditing} className="text-sm text-slate-500" placeholder="时间" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                       <span className="font-semibold text-slate-600">角色:</span>
                       <EditableField value={project.role} onChange={(v) => updateProject(idx, "role", v)} isEditing={isEditing} placeholder="角色" />
                    </div>
                    <EditableField value={project.desc} onChange={(v) => updateProject(idx, "desc", v)} isEditing={isEditing} multiline={true} className="text-sm text-slate-700 mb-2 italic" placeholder="描述" />
                    
                     {project.details && (
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                        {project.details.map((detail, dIdx) => (
                          <li key={dIdx} className="pl-1 relative group/detail">
                             <div className="flex items-start gap-2">
                               {isEditing && <button onClick={() => removeProjectDetail(idx, dIdx)} className="text-red-400 hover:text-red-600 shrink-0"><X size={12}/></button>}
                               <EditableField value={detail} onChange={(v) => updateProjectDetail(idx, dIdx, v)} isEditing={isEditing} multiline={true} className="w-full" />
                             </div>
                          </li>
                        ))}
                        {isEditing && (
                           <li className="list-none -ml-4 mt-1"><button onClick={() => addProjectDetail(idx)} className="text-xs text-blue-500 hover:underline">+ 详情</button></li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
           </section>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Education */}
          <section>
            <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-4 pb-1 flex justify-between items-center`}>
              教育经历
              <SectionControls onAdd={addEducation} label="" isEditing={isEditing} />
            </h3>
            <div className="space-y-4">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="relative group/item">
                  {isEditing && <DeleteButton onClick={() => removeEducation(idx)} className="absolute -right-8 top-0" />}
                  <EditableField value={edu.institution} onChange={(v) => updateEducation(idx, "institution", v)} isEditing={isEditing} className="font-bold text-slate-800 block" placeholder="学校" />
                  <EditableField value={edu.major} onChange={(v) => updateEducation(idx, "major", v)} isEditing={isEditing} className="text-sm text-slate-600 block" placeholder="专业" />
                   <div className="text-xs text-slate-500 flex gap-1 mt-1">
                      <EditableField value={edu.degree} onChange={(v) => updateEducation(idx, "degree", v)} isEditing={isEditing} placeholder="学位" />
                      <span>•</span>
                      <EditableField value={edu.start} onChange={(v) => updateEducation(idx, "start", v)} isEditing={isEditing} placeholder="开始" />
                      <span>-</span>
                      <EditableField value={edu.end} onChange={(v) => updateEducation(idx, "end", v)} isEditing={isEditing} placeholder="结束" />
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-4 pb-1`}>技能</h3>
            <div className="space-y-3">
              {[
                { key: "languages", label: "开发语言" },
                { key: "frontend", label: "前端" },
                { key: "backend", label: "后端" },
                { key: "hardware", label: "硬件" }
              ].map((cat) => (
                <div key={cat.key}>
                   <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-500 uppercase">{cat.label}</span>
                      <SectionControls onAdd={() => addSkill(cat.key)} label="" isEditing={isEditing} />
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {resume.skills[cat.key].map((skill, idx) => (
                        <div key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1 group/item">
                          <EditableField value={skill} onChange={(v) => updateSkills(cat.key, idx, v)} isEditing={isEditing} />
                          {isEditing && <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(cat.key, idx)} />}
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </section>

           {/* Certificates */}
           <section>
             <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-4 pb-1 flex justify-between items-center`}>
               证书
               <SectionControls onAdd={addCertificate} label="" isEditing={isEditing} />
             </h3>
             <ul className="space-y-2">
                {resume.certificates.map((cert, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2 relative group/item">
                    {isEditing && <button onClick={() => removeCertificate(idx)} className="text-red-400 shrink-0"><X size={12}/></button>}
                    <span className="text-slate-400 mt-1">•</span>
                    <EditableField value={cert} onChange={(v) => updateCertificate(idx, v)} isEditing={isEditing} className="w-full" />
                  </li>
                ))}
             </ul>
           </section>
        </div>
      </div>
    </div>
  );
};


// --- Main Application ---

const App = () => {
  const [resume, setResume] = useState(() => {
    const saved = localStorage.getItem("resume_data");
    return saved ? JSON.parse(saved) : initialResumeData;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [themeColor, setThemeColor] = useState(THEME_COLORS.blue);
  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES.modern);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem("resume_data", JSON.stringify(resume));
  }, [resume]);

  // Update handlers
  const updateBasic = (field, value) => {
    setResume(prev => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
  };

  const updateEducation = (idx, field, value) => {
    const newEdu = [...resume.education];
    newEdu[idx] = { ...newEdu[idx], [field]: value };
    setResume(prev => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { institution: "新学校", major: "新专业", degree: "学位", start: "20xx", end: "20xx" }]
    }));
  };

  const removeEducation = (idx) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };

  const updateSkills = (category, idx, value) => {
    const newSkills = { ...resume.skills };
    newSkills[category][idx] = value;
    setResume(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = (category) => {
    const newSkills = { ...resume.skills };
    newSkills[category] = [...newSkills[category], "新技能"];
    setResume(prev => ({ ...prev, skills: newSkills }));
  };

  const removeSkill = (category, idx) => {
    const newSkills = { ...resume.skills };
    newSkills[category] = newSkills[category].filter((_, i) => i !== idx);
    setResume(prev => ({ ...prev, skills: newSkills }));
  };

  const updateCertificate = (idx, value) => {
    const newCerts = [...resume.certificates];
    newCerts[idx] = value;
    setResume(prev => ({ ...prev, certificates: newCerts }));
  };

  const addCertificate = () => {
    setResume(prev => ({ ...prev, certificates: [...prev.certificates, "新证书"] }));
  };

  const removeCertificate = (idx) => {
    setResume(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }));
  };

  const updateProject = (idx, field, value) => {
    const newProj = [...resume.projects];
    newProj[idx] = { ...newProj[idx], [field]: value };
    setResume(prev => ({ ...prev, projects: newProj }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [{ name: "新项目", role: "角色", date: "时间", desc: "描述...", details: ["详情..."] }, ...prev.projects]
    }));
  };

  const removeProject = (idx) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
  };

  const updateProjectDetail = (pIdx, dIdx, value) => {
    const newProj = [...resume.projects];
    newProj[pIdx].details[dIdx] = value;
    setResume(prev => ({ ...prev, projects: newProj }));
  };

  const addProjectDetail = (pIdx) => {
    const newProj = [...resume.projects];
    newProj[pIdx].details.push("新详情条目");
    setResume(prev => ({ ...prev, projects: newProj }));
  };

  const removeProjectDetail = (pIdx, dIdx) => {
    const newProj = [...resume.projects];
    newProj[pIdx].details = newProj[pIdx].details.filter((_, i) => i !== dIdx);
    setResume(prev => ({ ...prev, projects: newProj }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      setShowExitDialog(true);
    } else {
      setIsEditing(true);
    }
  };

  const confirmExitEdit = () => {
    setIsEditing(false);
    setShowExitDialog(false);
  };

  const handlePrint = () => {
    const wasEditing = isEditing;
    setIsEditing(false);
    // Give React a moment to re-render without edit UI before printing
    setTimeout(() => {
      window.print();
      // Restore edit mode if it was on (optional, usually users expect it to stay preview)
      if (wasEditing) setIsEditing(true);
    }, 500);
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileImportRef = useRef(null);
  
  const handleImportClick = () => {
    fileImportRef.current.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target.result;
        if (typeof result === 'string') {
          const importedData = JSON.parse(result);
          // Basic validation could go here
          setResume(importedData);
          alert("数据导入成功！");
        }
      } catch (err) {
        alert("导入失败：文件格式错误");
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans print:bg-white pb-20 print:pb-0">
      
      {/* Toolbar - No Print */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl rounded-full p-2 flex items-center gap-2 z-50 print:hidden border border-slate-200">
        
        <button 
          onClick={toggleEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            isEditing 
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
          {isEditing ? "完成编辑" : "编辑简历"}
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button 
            onClick={() => setCurrentTemplate(TEMPLATES.modern)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${currentTemplate === TEMPLATES.modern ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            现代侧边
          </button>
           <button 
            onClick={() => setCurrentTemplate(TEMPLATES.classic)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${currentTemplate === TEMPLATES.classic ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            经典专业
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <div className="flex items-center gap-1 px-2">
           {Object.keys(THEME_COLORS).map(color => (
             <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === color ? 'border-slate-600 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color === 'slate' ? '#475569' : color === 'emerald' ? '#10b981' : color === 'violet' ? '#8b5cf6' : color === 'rose' ? '#f43f5e' : '#3b82f6' }}
              title={color}
             />
           ))}
        </div>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-lg"
          title="导出 PDF"
        >
          <Download size={18} />
          <span className="hidden sm:inline">导出 PDF</span>
        </button>

         <div className="relative group">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
               <Save size={18} />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-2 flex flex-col gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-32 text-sm">
               <button onClick={handleBackup} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded text-slate-700 text-left">
                  <FileJson size={14}/> 备份数据
               </button>
               <button onClick={handleImportClick} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded text-slate-700 text-left">
                  <UploadCloud size={14}/> 导入备份
               </button>
               <input type="file" ref={fileImportRef} onChange={handleImportFile} className="hidden" accept=".json" />
            </div>
         </div>
      </div>

      {/* Exit Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">确认退出编辑？</h3>
            <p className="text-slate-600 mb-6 text-sm">您的更改会自动保存，确定要切换回预览模式吗？</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowExitDialog(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm"
              >
                取消
              </button>
              <button 
                onClick={confirmExitEdit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-lg shadow-blue-200"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Container - A4 Size Aspect Ratio managed largely by content but constrained max-width */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none print:w-full min-h-[297mm]">
        {currentTemplate === TEMPLATES.modern ? (
          <ModernTemplate 
            resume={resume} 
            isEditing={isEditing} 
            updateBasic={updateBasic}
            updateEducation={updateEducation}
            updateSkills={updateSkills}
            updateCertificate={updateCertificate}
            updateProject={updateProject}
            updateProjectDetail={updateProjectDetail}
            addEducation={addEducation}
            removeEducation={removeEducation}
            addSkill={addSkill}
            removeSkill={removeSkill}
            addCertificate={addCertificate}
            removeCertificate={removeCertificate}
            addProject={addProject}
            removeProject={removeProject}
            addProjectDetail={addProjectDetail}
            removeProjectDetail={removeProjectDetail}
            themeColor={themeColor}
          />
        ) : (
          <ClassicTemplate 
            resume={resume} 
            isEditing={isEditing} 
            updateBasic={updateBasic}
            updateEducation={updateEducation}
            updateSkills={updateSkills}
            updateCertificate={updateCertificate}
            updateProject={updateProject}
            updateProjectDetail={updateProjectDetail}
            addEducation={addEducation}
            removeEducation={removeEducation}
            addSkill={addSkill}
            removeSkill={removeSkill}
            addCertificate={addCertificate}
            removeCertificate={removeCertificate}
            addProject={addProject}
            removeProject={removeProject}
            addProjectDetail={addProjectDetail}
            removeProjectDetail={removeProjectDetail}
            themeColor={themeColor}
          />
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
