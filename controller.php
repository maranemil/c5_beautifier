<?php /** @noinspection PhpUnusedLocalVariableInspection */
/** @noinspection PhpUndefinedConstantInspection */
/** @noinspection PhpUndefinedFunctionInspection */
/** @noinspection PhpUndefinedClassInspection */
/** @noinspection AutoloadingIssuesInspection */
/** @noinspection PhpUnused */
defined('C5_EXECUTE') or die("Access Denied.");

/**
 * Class C5BeautifierPackage
 * @method configurePackage(C5BeautifierPackage $pkg)
 */
class C5BeautifierPackage extends Package
{

    protected $pkgHandle = 'c5_beautifier';
    protected $appVersionRequired = "5.4.1";
    protected $pkgVersion = "0.1.1";

    public function getPackageDescription()
    {
        return t("CodeMirror syntax highlighter for textarea working together with tinyMCE in Concrete5 ");
    }

    public function GetPackageName()
    {
        return t("C5 syntax highlighter based on CodeMirror v0.1");
    }

    public function install()
    {
        $pkg = parent::install();

        /* @var $fh FileHelper */
        $fh = Loader::helper('file');

        $sourceCSS = DIR_PACKAGES . "/" . $this->pkgHandle . "/css/";
        $targetCSS = DIR_BASE . "/css/";
        $fh->copyAll($sourceCSS, $targetCSS, $mode = null); // @ $mode = 0777

        $sourceJS = DIR_PACKAGES . "/" . $this->pkgHandle . "/js/.";
        $targetJS = DIR_BASE . "/js/";
        $fh->copyAll($sourceJS, $targetJS,  null);
    }

    public function uninstall()
    {
        parent::uninstall();

        /* @var $fh FileHelper */
        $fh = Loader::helper('file');

        $targetJS = DIR_BASE . "/js/";
        $fh->removeAll($targetJS);

        $targetCSS = DIR_BASE . "/css/";
        $fh->removeAll($targetCSS);
    }

    public function upgrade()
    {
        $pkg = $this;
        parent::upgrade();
        $this->configurePackage($pkg);
    }
}

// vim: set noexpandtab ts=4 :
