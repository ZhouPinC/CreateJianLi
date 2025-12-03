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
  Globe
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

const initialResumeData = {
  basics: {
    name: "周品丞",
    title: "前端 / 移动开发工程师",
    phone: "15211018065",
    email: "762498595@qq.com",
    location: "长沙",
    salary: "5-10K",
    experience: "21岁 | 男",
    summary: "22级物联网工程专业。具有扎实的前端（安卓，鸿蒙，Web，小程序，Win桌面应用）开发经验，以及单片机（STM32, ESP32）开发经验。工作积极认真，细心负责，善于分析和解决问题。学习能力强，能快速上手新技术，拥有强烈的团队荣誉感。熟练使用AI工具辅助开发，提升工作效率。",
    avatar: "" // Base64 string for avatar
  },
  education: [
    {
      institution: "长沙师范学院",
      major: "物联网工程",
      degree: "本科",
      start: "2022",
      end: "2026"
    }
  ],
  skills: {
    languages: ["Java", "C++", "Python", "ArkTS", "JavaScript/TypeScript"],
    frontend: ["Android", "HarmonyOS", "Web (React/Vue)", "微信小程序", "Qt", "ETS"],
    backend: ["MySQL", "Django", "Java Socket"],
    hardware: ["STM32", "ESP32", "C51", "FreeRTOS", "Sensors/Actuators"],
    others: ["Git", "Linux", "AI Tools Integration"]
  },
  certificates: [
    "日语 JLPT N2",
    "计算机程序设计员 (四级)",
    "软件著作权《基于Web的智能电梯信息监控平台》",
    "全国计算机二级考试",
    "普通话水平测试二级甲等",
    "机动车驾驶证 (C1)"
  ],
  projects: [
    {
      name: "恒达科技公司官网",
      role: "负责人",
      date: "2025.04 - 2025.04",
      desc: "负责公司官网的全栈开发与维护。",
      details: [
        "定义产品、招聘等模型类，通过ORM映射数据库表，实现数据结构化存储。",
        "定制Django Admin后台，配置高级筛选与批量操作，优化数据管理流程。",
        "自定义CSS样式与交互细节，集成Django认证系统，实现分组权限管理。"
      ]
    },
    {
      name: "智慧农业检测控制小程序",
      role: "负责人",
      date: "2024.07 - 2024.07",
      desc: "集软硬件于一体的智慧农业解决方案。",
      details: [
        "设计微信小程序前端及交互，集成讯飞星火AI API提供智能问答服务。",
        "基于FreeRTOS与STM32实时采集传感器数据，通过ESP32 WiFi/蓝牙模块实现端到端通信。"
      ]
    },
    {
      name: "智能手表系统 (STM32 + FreeRTOS)",
      role: "负责人",
      date: "2025.07 - 2025.07",
      desc: "基于嵌入式系统的智能穿戴设备原型。",
      details: [
        "利用FreeRTOS创建多任务系统，实现按键输入与任务切换。",
        "使用UART调试，I2C驱动OLED屏幕，TIM定时器控制螺旋编码器。"
      ]
    },
    {
      name: "仿小米历史记录计算器 (Android)",
      role: "开发者",
      date: "2024.10 - 2024.10",
      desc: "原生Android应用开发。",
      details: [
        "高度还原小米计算器UI，实现历史记录存储与一键复现功能。",
        "使用MySQL进行数据持久化存储。"
      ]
    },
    {
      name: "三端联通猜数字游戏",
      role: "开发者",
      date: "2025.11 - 2025.11",
      desc: "Java桌面端 + 小程序 + Web端跨平台互动游戏。",
      details: [
        "通过Socket发送JSON数据实现多端实时通信。",
        "开发Web后台查看用户详细信息与游戏历史记录。"
      ]
    },
    {
      name: "鸿蒙仿微信主页面",
      role: "开发者",
      date: "2025.11",
      desc: "基于HarmonyOS ArkTS开发的高保真界面还原。"
    },
    {
      name: "ESP32环境监测系统",
      role: "开发者",
      date: "2025.11",
      desc: "集成光照、温湿度、CO2等多传感器的数据采集与蜂鸣器/风扇联动控制。"
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
    <div className="flex flex-col md:flex-row h-full min-h-[297mm]">
      {/* Left Sidebar */}
      <div className={`w-full md:w-1/3 ${sidebarBg} text-slate-300 p-8 flex flex-col gap-8 print:w-1/3 print:h-full`}>
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
      <div className="w-full md:w-2/3 p-8 md:p-12 text-slate-800 print:w-2/3 print:p-8 bg-white">
        
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
           {/* Experience */}
           <section>
              <h3 className={`text-lg font-bold uppercase tracking-widest ${themeText} border-b border-slate-200 mb-4 pb-1 flex justify-between items-center`}>
                项目经历
                <SectionControls onAdd={addProject} label="项目" isEditing={isEditing} />
              </h3>
              <div className="space-y-6">
                {resume.projects.map((project, idx) => (
                  <div key={idx} className="relative group/item">
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
                    <EditableField value={cert} onChange={(v) => updateCertificate(idx, v)} isEditing={isEditing} multiline={true} className="w-full" />
                  </li>
                ))}
             </ul>
           </section>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem("resume_data_v2");
      return saved ? JSON.parse(saved) : initialResumeData;
    } catch (e) {
      return initialResumeData;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [template, setTemplate] = useState(TEMPLATES.modern);
  const [themeColor, setThemeColor] = useState(THEME_COLORS.blue);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem("resume_data_v2", JSON.stringify(resume));
  }, [resume]);

  const handlePrint = () => {
    setIsEditing(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExitEditAttempt = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setIsEditing(false);
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const resetData = () => {
    if (confirm("确定要重置简历到初始状态吗？所有修改将丢失。")) {
      setResume(initialResumeData);
    }
  };

  // --- Update Handlers (Refactored to be cleaner) ---
  const updateBasic = (field, value) => setResume(p => ({...p, basics: {...p.basics, [field]: value}}));
  
  const updateEducation = (idx, field, value) => {
    const arr = [...resume.education]; arr[idx] = {...arr[idx], [field]: value};
    setResume(p => ({...p, education: arr}));
  };
  const addEducation = () => setResume(p => ({...p, education: [...p.education, { institution: "学校", major: "专业", degree: "学历", start: "2024", end: "2025" }]}));
  const removeEducation = (idx) => setResume(p => ({...p, education: p.education.filter((_, i) => i !== idx)}));

  const updateSkills = (cat, idx, value) => {
    const skills = {...resume.skills}; skills[cat][idx] = value;
    setResume(p => ({...p, skills}));
  };
  const addSkill = (cat) => {
    const skills = {...resume.skills}; skills[cat] = [...skills[cat], "新技能"];
    setResume(p => ({...p, skills}));
  };
  const removeSkill = (cat, idx) => {
    const skills = {...resume.skills}; skills[cat] = skills[cat].filter((_, i) => i !== idx);
    setResume(p => ({...p, skills}));
  };

  const updateCertificate = (idx, value) => {
    const arr = [...resume.certificates]; arr[idx] = value;
    setResume(p => ({...p, certificates: arr}));
  };
  const addCertificate = () => setResume(p => ({...p, certificates: [...p.certificates, "新证书"]}));
  const removeCertificate = (idx) => setResume(p => ({...p, certificates: p.certificates.filter((_, i) => i !== idx)}));

  const updateProject = (idx, field, value) => {
    const arr = [...resume.projects]; arr[idx] = {...arr[idx], [field]: value};
    setResume(p => ({...p, projects: arr}));
  };
  const updateProjectDetail = (pIdx, dIdx, value) => {
    const arr = [...resume.projects]; arr[pIdx].details[dIdx] = value;
    setResume(p => ({...p, projects: arr}));
  };
  const addProject = () => setResume(p => ({...p, projects: [{ name: "新项目", role: "角色", date: "时间", desc: "描述", details: ["细节"] }, ...p.projects]}));
  const removeProject = (idx) => setResume(p => ({...p, projects: p.projects.filter((_, i) => i !== idx)}));
  const addProjectDetail = (idx) => {
    const arr = [...resume.projects]; if(!arr[idx].details) arr[idx].details = []; arr[idx].details.push("详情");
    setResume(p => ({...p, projects: arr}));
  };
  const removeProjectDetail = (pIdx, dIdx) => {
    const arr = [...resume.projects]; arr[pIdx].details = arr[pIdx].details.filter((_, i) => i !== dIdx);
    setResume(p => ({...p, projects: arr}));
  };

  const commonProps = {
    resume, isEditing, updateBasic, updateEducation, updateSkills, updateCertificate, updateProject, updateProjectDetail,
    addEducation, removeEducation, addSkill, removeSkill, addCertificate, removeCertificate, addProject, removeProject,
    addProjectDetail, removeProjectDetail, themeColor
  };

  return (
    <div className="min-h-screen p-0 md:p-8 flex flex-col items-center bg-gray-100 font-sans pb-32">
      
      {/* Floating Toolbar */}
      <div className="no-print fixed bottom-8 z-50 flex gap-4 items-end pointer-events-none w-full max-w-[210mm] justify-end px-4">
        
        {/* Editing Controls (Pointer Events Auto) */}
        <div className="flex flex-col gap-3 pointer-events-auto items-end">
           
           {/* Template & Color Switcher (Only visible in edit mode) */}
           {isEditing && (
             <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1"><Layout size={12}/> 模板布局</span>
                  <div className="flex gap-2">
                    <button onClick={() => setTemplate(TEMPLATES.modern)} className={`px-3 py-1.5 rounded text-sm transition-colors ${template === TEMPLATES.modern ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>现代</button>
                    <button onClick={() => setTemplate(TEMPLATES.classic)} className={`px-3 py-1.5 rounded text-sm transition-colors ${template === TEMPLATES.classic ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>经典</button>
                  </div>
                </div>
                <div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1"><Palette size={12}/> 主题颜色</span>
                   <div className="flex gap-2">
                      {Object.keys(THEME_COLORS).map(color => (
                        <button 
                          key={color}
                          onClick={() => setThemeColor(color)}
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${themeColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                          style={{ backgroundColor: color === 'slate' ? '#475569' : color === 'emerald' ? '#10b981' : color === 'violet' ? '#8b5cf6' : color === 'rose' ? '#f43f5e' : '#3b82f6' }}
                        />
                      ))}
                   </div>
                </div>
                <div className="h-px bg-slate-100 my-1"></div>
                 <button onClick={resetData} className="text-red-500 text-xs hover:underline text-left">重置所有数据</button>
             </div>
           )}

           <div className="flex gap-3">
             {/* Edit Toggle Buttons */}
             {isEditing ? (
               <>
                <button 
                  onClick={handleExitEditAttempt}
                  className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
                  title="取消编辑"
                >
                  <X size={24} />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
                  title="保存并完成"
                >
                  <Check size={24} />
                  <span className="font-bold pr-2">完成</span>
                </button>
               </>
             ) : (
               <button 
                onClick={() => setIsEditing(true)}
                className="bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Edit2 size={24} />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap px-0 group-hover:px-2">
                  编辑简历
                </span>
              </button>
             )}

             {/* Download */}
             <button 
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Download size={24} />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap px-0 group-hover:px-2">
                  下载
                </span>
              </button>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-800 mb-2">退出编辑模式？</h3>
            <p className="text-slate-600 mb-6">您的修改已经自动保存。确定要退出编辑视图吗？</p>
            <div className="flex gap-3 justify-end">
              <button onClick={cancelExit} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={confirmExit} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">确定退出</button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Container */}
      <div className={`w-full max-w-[210mm] bg-white shadow-2xl print-shadow-none transition-all duration-300 ${isEditing ? "scale-[1.02] ring-4 ring-blue-500/20 my-8" : ""}`}>
        {template === TEMPLATES.modern ? (
          <ModernTemplate {...commonProps} />
        ) : (
          <ClassicTemplate {...commonProps} />
        )}
      </div>

      <footer className="mt-8 text-slate-400 text-sm no-print">
        <p>Built with React & Tailwind</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
