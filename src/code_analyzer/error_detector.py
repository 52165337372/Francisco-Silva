#!/usr/bin/env python3
"""
JARVIS Trading Bot - Detector de Erros de Código
Identifica problemas, vulnerabilidades e padrões ruins
"""

import re
import ast
from typing import List, Dict
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CodeError:
    """Estrutura de um erro detectado"""
    line_number: int
    error_type: str
    message: str
    severity: str  # "critical", "warning", "info"
    suggestion: str

class ErrorDetector:
    """Detecta erros em código Python"""
    
    def __init__(self):
        self.errors: List[CodeError] = []
        logger.info("[CODE ANALYZER] Detector de erros inicializado")
    
    def analyze_code(self, code: str) -> List[CodeError]:
        """Analisa código e detecta erros"""
        self.errors = []
        lines = code.split('\n')
        
        # Executar verificações
        self._check_syntax(code)
        self._check_imports(lines)
        self._check_exception_handling(lines)
        self._check_undefined_variables(code, lines)
        self._check_security_issues(lines)
        self._check_style_issues(lines)
        
        logger.info(f"[CODE ANALYZER] {len(self.errors)} problemas encontrados")
        return self.errors
    
    def _check_syntax(self, code: str):
        """Verifica erros de sintaxe"""
        try:
            ast.parse(code)
        except SyntaxError as e:
            self.errors.append(CodeError(
                line_number=e.lineno or 0,
                error_type="SyntaxError",
                message=str(e),
                severity="critical",
                suggestion="Verifique a sintaxe Python nesta linha"
            ))
    
    def _check_imports(self, lines: List[str]):
        """Verifica imports não utilizados"""
        import_pattern = r'^\s*import\s+|\s*from\s+.+\s+import\s+'
        imports = {}
        
        for i, line in enumerate(lines, 1):
            if re.match(import_pattern, line):
                match = re.search(r'import\s+(\w+)', line)
                if match:
                    imports[match.group(1)] = i
        
        full_code = '\n'.join(lines)
        for imp, line_no in imports.items():
            if full_code.count(imp) <= 1:
                self.errors.append(CodeError(
                    line_number=line_no,
                    error_type="UnusedImport",
                    message=f"Import '{imp}' não utilizado",
                    severity="warning",
                    suggestion=f"Remova 'import {imp}' ou use-o no código"
                ))
    
    def _check_exception_handling(self, lines: List[str]):
        """Verifica exceções genéricas"""
        for i, line in enumerate(lines, 1):
            if re.search(r'except\s*:', line):
                self.errors.append(CodeError(
                    line_number=i,
                    error_type="GenericException",
                    message="Exceção genérica encontrada",
                    severity="warning",
                    suggestion="Use 'except SpecificError:' em vez de 'except:'"
                ))
            
            if re.search(r'except\s+Exception', line):
                self.errors.append(CodeError(
                    line_number=i,
                    error_type="BroadException",
                    message="Exceção muito ampla",
                    severity="warning",
                    suggestion="Capture exceções específicas"
                ))
    
    def _check_undefined_variables(self, code: str, lines: List[str]):
        """Verifica variáveis não definidas"""
        # Implementação simplificada
        pass
    
    def _check_security_issues(self, lines: List[str]):
        """Verifica problemas de segurança"""
        security_patterns = [
            (r'eval\(', 'eval', '🔴 CRÍTICO: Nunca use eval()'),
            (r'exec\(', 'exec', '🔴 CRÍTICO: Nunca use exec()'),
            (r'pickle\.loads', 'pickle.loads', '⚠️ Risco de segurança com pickle'),
            (r'shell=True', 'shell=True', '⚠️ Risco de injeção: use shell=False'),
            (r'os\.system', 'os.system', '⚠️ Risco de injeção de comando'),
            (r'__import__', '__import__', '⚠️ Importação dinâmica perigosa'),
        ]
        
        for i, line in enumerate(lines, 1):
            for pattern, name, msg in security_patterns:
                if re.search(pattern, line):
                    self.errors.append(CodeError(
                        line_number=i,
                        error_type="SecurityIssue",
                        message=msg,
                        severity="critical",
                        suggestion=f"Evite usar {name}"
                    ))
    
    def _check_style_issues(self, lines: List[str]):
        """Verifica problemas de estilo/PEP8"""
        for i, line in enumerate(lines, 1):
            # Linhas muito longas
            if len(line) > 120:
                self.errors.append(CodeError(
                    line_number=i,
                    error_type="StyleIssue",
                    message="Linha muito longa",
                    severity="info",
                    suggestion="Limite linhas a 120 caracteres"
                ))
            
            # Espaços em branco desnecessários
            if re.search(r'\s+$', line):
                self.errors.append(CodeError(
                    line_number=i,
                    error_type="StyleIssue",
                    message="Espaços em branco no final da linha",
                    severity="info",
                    suggestion="Remove espaços em branco no final"
                ))
            
            # Múltiplos espaços
            if re.search(r'  {2,}', line):
                self.errors.append(CodeError(
                    line_number=i,
                    error_type="StyleIssue",
                    message="Múltiplos espaços consecutivos",
                    severity="info",
                    suggestion="Use um espaço ou tab para indentação"
                ))
    
    def get_summary(self) -> Dict:
        """Retorna resumo dos erros"""
        return {
            "total": len(self.errors),
            "critical": sum(1 for e in self.errors if e.severity == "critical"),
            "warnings": sum(1 for e in self.errors if e.severity == "warning"),
            "info": sum(1 for e in self.errors if e.severity == "info")
        }
    
    def get_errors_by_severity(self, severity: str) -> List[CodeError]:
        """Retorna erros por severidade"""
        return [e for e in self.errors if e.severity == severity]

if __name__ == "__main__":
    # Teste
    bad_code = """
import json
import os  # Não utilizado

def risky_function():
    try:
        result = eval(input())  # RISCO!
        return result
    except:
        pass
"""
    
    detector = ErrorDetector()
    errors = detector.analyze_code(bad_code)
    
    print("\n🐛 ERROS DETECTADOS:")
    for error in errors:
        print(f"\nLinha {error.line_number}: [{error.error_type}]")
        print(f"  Mensagem: {error.message}")
        print(f"  Sugestão: {error.suggestion}")
    
    print(f"\n📊 RESUMO:\n{detector.get_summary()}")
