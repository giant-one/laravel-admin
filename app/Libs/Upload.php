<?php
/**
 * Created by PhpStorm.
 */

namespace App\Libs;

use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Upload
{
    /**
     * @var UploadedFile $file ;
     */
    protected $file;
    /**
     * 上传错误信息
     * @var string
     */
    private $error = ''; //上传错误信息
    private $fullPath = '';//绝对地址
    private $config = array(
        'maxSize' => 0, //上传的文件大小限制 (0-不做限制)
        'exts' => array('jpg', 'jpeg', 'gif', 'png'), //允许上传的后缀
        'subName' => '', //子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
        'rootPath' => '/uploads/photo', //保存根路径
        'savePath' => '', //保存路径
        'thumb' => array(),//是裁剪压缩比例
    );

    public function __construct($config = array())
    {
        /* 获取配置 */
        $this->config = array_merge($this->config, $config);
        if (!empty($this->config['exts'])) {
            if (is_string($this->exts)) {
                $this->config['exts'] = explode(',', $this->exts);
            }
            $this->config['exts'] = array_map('strtolower', $this->exts);
        }
        $this->config['subName'] = $this->subName ? ltrim($this->subName, '/') : '/' . date('Ymd');
        $this->fullPath = rtrim(public_path(), '/') . $this->config['rootPath'];
    }

    public function __get($name)
    {
        return $this->config[$name];
    }

    public function __set($name, $value)
    {
        if (isset($this->config[$name])) {
            $this->config[$name] = $value;
        }
    }

    public function __isset($name)
    {
        return isset($this->config[$name]);
    }

    /**
     * 获取最后一次上传错误信息
     * @return string 错误信息
     */
    public function getError()
    {
        return $this->error;
    }

    public function upload($file)
    {

        if (empty($file)) {
            $this->error = '没有上传的文件';
            return false;
        }
        if (!$this->checkRootPath($this->fullPath)) {
            $this->error = $this->getError();
            return false;
        }
        $fileSavePath = $this->fullPath . $this->savePath . $this->subName;
        if (!$this->checkSavePath($fileSavePath)) {
            $this->error = $this->getError();
            return false;
        }
        $files = array();
        if (!is_array($file)) {
            //如果不是数组转成数组
            $files[] = $file;
        } else {
            $files = $file;
        }
        $info = array();
        foreach ($files as $key => $f) {
            $this->file = $f;
            $f->ext = strtolower($f->getClientOriginalExtension());
            /*文件上传检查*/
            if (!$this->check($f)) {
                continue;
            }
            $fileName = str_random(12) . '.' . $f->ext;
            /* 保存文件 并记录保存成功的文件 */
            if ($this->file->move($fileSavePath, $fileName)) {
                $info[] = $this->rootPath . $this->savePath . $this->subName . '/' . $fileName;
            }
        }
        return is_array($info) ? $info : false;
    }

    /**
     * 检测上传根目录
     * @param string $rootPath 根目录
     * @return boolean true-检测通过，false-检测失败
     */
    protected function checkRootPath($rootPath)
    {
        if (!(is_dir($rootPath) && is_writable($rootPath))) {
            $this->error = '上传根目录不存在！';
            return false;
        }
        return true;
    }

    /**
     * 检测上传目录
     * @param string $savePath 上传目录
     * @return boolean     检测结果，true-通过，false-失败
     */
    public function checkSavePath($savePath)
    {
        /* 检测并创建目录 */
        if (!$this->mkdir($savePath)) {
            return false;
        } else {
            /* 检测目录是否可写 */
            if (!is_writable($savePath)) {
                $this->error = '上传目录不可写！';
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * 检查上传的文件
     * @param array $file 文件信息
     * @return bool
     */
    private function check($file)
    {
        /* 检查文件大小 */
        if (!$this->checkSize($file->getSize())) {
            $this->error = '上传文件大小不符！';
            return false;
        }
        /* 检查文件后缀 */
        if (!$this->checkExt($file->ext)) {
            $this->error = '上传文件后缀不允许';
            return false;
        }
        /* 通过检测 */
        return true;
    }

    /**
     * 检查文件大小是否合法
     * @param integer $size 数据
     * @return bool
     */
    private function checkSize($size)
    {
        return !($size > $this->maxSize) || (0 == $this->maxSize);
    }

    /**
     * 检查上传的文件后缀是否合法
     * @param string $ext 后缀
     * @return bool
     */
    private function checkExt($ext)
    {
        return empty($this->config['exts']) ? true : in_array(strtolower($ext), $this->exts);
    }

    /**
     * 创建目录
     * @param string $savePath 要创建的穆里
     * @return boolean     创建状态，true-成功，false-失败
     */
    protected function mkdir($savePath)
    {
        if (is_dir($savePath)) {
            return true;
        }
        if (mkdir($savePath, 0777, true)) {
            return true;
        } else {
            $this->error = "目录创建失败";
            return false;
        }
    }
}