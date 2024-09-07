package usecase

import (
	"os"

	"github.com/google/uuid"
)

func createFolder() (string, error) {
	folderName := uuid.New().String()
	folderPath := "./internal/module/latex_compiler/latex_source/" + folderName
	err := os.Mkdir(folderPath, os.ModeAppend)
	if err != nil {
		return "", err
	}
	// có 2 vấn đề:
	// 		1. 1 số package chưa có phải tải -> lỗi (lỗi timeout), phải config để package đc tải on the fly
	// 		2. Ban đầu khi t dùng package minted thì nó lỗi là thiếu outdir cho cài package này, phải chỉnh lại thêm
	// 		[cache=false] thì mới chạy đc
	texContent := `\documentclass[preview,border=12pt]{standalone}
\usepackage{amsmath} % Optional, for math environments if needed
\usepackage{geometry}
\usepackage{vntex}
\usepackage[cache=false]{minted}

% Set page geometry to increase width
\geometry{a4paper, margin=2cm}

\begin{document}
% Your question here
\textbf{Câu 2:} Cho biết giá trị các phần tử của mảng A sau khi thực hiện đoạn lệnh dưới đây:

\begin{minted}[xleftmargin=30pt,linenos,breaklines,breakanywhere]{cpp}
int A[] = ...;
int b, *p=A+2;
b =* p++;
*p+=2*b;
p++;
*p+=1;
\end{minted}

\begin{enumerate}
    \item {5, 7, 20, 20, 2, 6}
    \item {6, 20, 19, 1, 3, 6}
    \item {5, 7, 19, 1, 2, 6}
    \item \textbf{{5, 7, 19, 39, 3, 6}}
\end{enumerate}
\end{document}`

	// Tên file .tex
	fileName := folderPath + "/output.tex"

	// Tạo và mở file .tex
	file, err := os.Create(fileName)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Ghi nội dung vào file .tex
	_, err = file.WriteString(texContent)
	if err != nil {
		return "", err
	}

	return folderPath, nil
}

func deleteFolder(folderPath string) error {
	err := os.RemoveAll(folderPath)
	if err != nil {
		return err
	}

	return nil
}
