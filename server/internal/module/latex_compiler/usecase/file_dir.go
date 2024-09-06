package usecase

import (
	"log/slog"
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
	texContent := `\begin{question}
[L.O.2.1] 
Với một khai báo macro trên C++ như:

\lstinline{#define MAX 50}

Chương trình nào sẽ thay các tên macro MAX xuất hiện trong chương trình bởi giá trị (50) của nó?

\datcot[2]
\bonpa
{\sai{Biên dịch (Compiler)}}
{\dung{Tiền xử lý (Preprocessor)}}
{\sai{Trình hợp ngữ (Assembler)}}
{\sai{Trình liên kết (Link editor)}}
\end{question}`

	// Tên file .tex
	fileName := folderPath + "/output.tex"

	// Tạo và mở file .tex
	file, err := os.Create(fileName)
	if err != nil {
		return "", err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			slog.Error("Can not close file", "error-message", err)
		}
	}(file)

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
