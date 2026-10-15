import React,{useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {navByRole} from './data';
function Logo(){return <Link className="logo" to="/"><span className="logo-mark">✦</span><span>med<span>connect</span></span></Link>}
function Button({children,variant='primary',...p}){return <button className={'btn '+variant} {...p}>{children}</button>}
function Card({children,className=''}){return <section className={'card '+className}>{children}</section>}
function Avatar({d,small=false}){return <div className={'avatar '+(small?'small':'')} style={{background:d?.color||'#dfecc1'}}>{d?.initials||'MC'}</div>}
import AppShell from '../features/shell/AppShell';

function Shell({children, role='patient'}) {
  return <AppShell>{children}</AppShell>;
}
function Stat({value,label,trend}){return <div className="stat"><b>{value}</b><span>{label}</span>{trend&&<small className="trend">↗ {trend}</small>}</div>}
function PageTitle({eyebrow,title,sub,action}){return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</div>}
export {Logo,Button,Card,Avatar,Shell,Stat,PageTitle};
